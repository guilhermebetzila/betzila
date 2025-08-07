"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Camera,
  CameraOff,
  Scan,
  CheckCircle,
  AlertTriangle,
  X,
  Flashlight,
  FlashlightOff,
  RotateCcw,
  Users,
  ExternalLink,
  Vibrate,
  VolumeX,
  Settings,
} from "lucide-react"

interface QRScannerProps {
  isOpen: boolean
  onClose: () => void
  onScanSuccess?: (data: string) => void
}

interface ScanResult {
  data: string
  type: "referral" | "url" | "text"
  isValid: boolean
  referralCode?: string
}

interface VibrationSettings {
  enabled: boolean
  intensity: "light" | "medium" | "strong"
  patterns: {
    success: number[]
    referral: number[]
    error: number[]
  }
}

export function QRScanner({ isOpen, onClose, onScanSuccess }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [isFlashOn, setIsFlashOn] = useState(false)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [supportedConstraints, setSupportedConstraints] = useState<any>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [vibrationSettings, setVibrationSettings] = useState<VibrationSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("qr-scanner-vibration")
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return {
      enabled: true,
      intensity: "medium" as const,
      patterns: {
        success: [100, 50, 100],
        referral: [200, 100, 200, 100, 200],
        error: [300],
      },
    }
  })

  // Verificar suporte à vibração
  const hasVibrationSupport = typeof navigator !== "undefined" && "vibrate" in navigator

  // Salvar configurações de vibração
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("qr-scanner-vibration", JSON.stringify(vibrationSettings))
    }
  }, [vibrationSettings])

  // Função para vibrar com padrões personalizados
  const triggerVibration = useCallback(
    (type: "success" | "referral" | "error") => {
      if (!hasVibrationSupport || !vibrationSettings.enabled) return

      let pattern = vibrationSettings.patterns[type]

      // Ajustar intensidade
      switch (vibrationSettings.intensity) {
        case "light":
          pattern = pattern.map((duration) => Math.max(50, duration * 0.6))
          break
        case "strong":
          pattern = pattern.map((duration) => duration * 1.5)
          break
        default: // medium
          break
      }

      try {
        navigator.vibrate(pattern)
      } catch (err) {
        console.warn("Vibração não suportada:", err)
      }
    },
    [hasVibrationSupport, vibrationSettings],
  )

  // Função simples para detectar padrões de QR Code
  const detectQRPattern = useCallback((imageData: ImageData): string | null => {
    const { data, width, height } = imageData

    // Converter para escala de cinza e detectar padrões
    const grayData = new Uint8Array(width * height)
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
      grayData[i / 4] = gray
    }

    // Detectar padrões de finder (cantos do QR Code)
    const finderPatterns = []
    const minSize = Math.min(width, height)
    const step = Math.max(1, Math.floor(minSize / 100))

    for (let y = 0; y < height - 20; y += step) {
      for (let x = 0; x < width - 20; x += step) {
        if (isFinderPattern(grayData, x, y, width, height)) {
          finderPatterns.push({ x, y })
        }
      }
    }

    // Se encontrou pelo menos 2 finder patterns, pode ser um QR Code
    if (finderPatterns.length >= 2) {
      // Tentar decodificar usando uma abordagem simples
      return tryDecodeQR(grayData, width, height, finderPatterns)
    }

    return null
  }, [])

  const isFinderPattern = (data: Uint8Array, x: number, y: number, width: number, height: number): boolean => {
    if (x + 6 >= width || y + 6 >= height) return false

    const threshold = 128
    const pattern = []

    // Verificar padrão 7x7 do finder pattern
    for (let dy = 0; dy < 7; dy++) {
      for (let dx = 0; dx < 7; dx++) {
        const idx = (y + dy) * width + (x + dx)
        pattern.push(data[idx] < threshold ? 1 : 0)
      }
    }

    // Padrão esperado do finder pattern (simplificado)
    const expectedPattern = [
      1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
    ]

    let matches = 0
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === expectedPattern[i]) matches++
    }

    return matches / pattern.length > 0.8 // 80% de similaridade
  }

  const tryDecodeQR = (data: Uint8Array, width: number, height: number, patterns: any[]): string | null => {
    // Implementação simplificada de decodificação
    // Em uma implementação real, usaríamos uma biblioteca como jsQR

    // Por enquanto, vamos simular alguns padrões conhecidos
    const commonPatterns = [
      { pattern: "betdreams.com/ref/", result: "https://betdreams.com/ref/DEMO2024" },
      { pattern: "betdreams", result: "https://betdreams.com/ref/SCAN2024" },
    ]

    // Simular detecção baseada na posição dos finder patterns
    if (patterns.length >= 3) {
      // QR Code completo detectado
      return "https://betdreams.com/ref/SCANNED2024"
    } else if (patterns.length >= 2) {
      // QR Code parcial
      return "https://betdreams.com/ref/PARTIAL2024"
    }

    return null
  }

  const processQRData = (data: string): ScanResult => {
    // Verificar se é um link de indicação da BetDreams
    const betdreamsRegex = /betdreams\.com\/ref\/([A-Z0-9]+)/i
    const match = data.match(betdreamsRegex)

    if (match) {
      return {
        data,
        type: "referral",
        isValid: true,
        referralCode: match[1],
      }
    }

    // Verificar se é uma URL válida
    try {
      new URL(data)
      return {
        data,
        type: "url",
        isValid: true,
      }
    } catch {
      return {
        data,
        type: "text",
        isValid: false,
      }
    }
  }

  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return

    // Configurar canvas com o tamanho do vídeo
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Desenhar frame atual do vídeo no canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Obter dados da imagem
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Tentar detectar QR Code
    const qrData = detectQRPattern(imageData)

    if (qrData) {
      const result = processQRData(qrData)
      setScanResult(result)
      setIsScanning(false)

      // Trigger vibração baseada no tipo de resultado
      if (result.isValid) {
        if (result.type === "referral") {
          triggerVibration("referral")
        } else {
          triggerVibration("success")
        }
      } else {
        triggerVibration("error")
      }

      if (onScanSuccess) {
        onScanSuccess(qrData)
      }

      // Parar o scanning
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
        scanIntervalRef.current = null
      }
    }
  }, [isScanning, detectQRPattern, onScanSuccess, triggerVibration])

  const startCamera = async () => {
    try {
      setError(null)

      // Verificar suporte a getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Câmera não suportada neste dispositivo")
      }

      // Obter constraints suportadas
      const constraints = navigator.mediaDevices.getSupportedConstraints()
      setSupportedConstraints(constraints)

      // Configurar constraints da câmera
      const videoConstraints: MediaTrackConstraints = {
        facingMode: facingMode,
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
      }

      // Adicionar torch se suportado
      if (constraints.torch && isFlashOn) {
        videoConstraints.torch = true
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setHasPermission(true)
      setIsScanning(true)

      // Iniciar scanning
      scanIntervalRef.current = setInterval(scanFrame, 100) // 10 FPS
    } catch (err: any) {
      console.error("Erro ao acessar câmera:", err)
      setHasPermission(false)

      if (err.name === "NotAllowedError") {
        setError("Permissão de câmera negada. Permita o acesso à câmera nas configurações.")
      } else if (err.name === "NotFoundError") {
        setError("Nenhuma câmera encontrada neste dispositivo.")
      } else if (err.name === "NotSupportedError") {
        setError("Câmera não suportada neste navegador.")
      } else {
        setError("Erro ao acessar câmera: " + err.message)
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }

    setIsScanning(false)
    setHasPermission(null)
  }

  const toggleFlash = async () => {
    if (!streamRef.current) return

    try {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      const capabilities = videoTrack.getCapabilities()

      if (capabilities.torch) {
        await videoTrack.applyConstraints({
          advanced: [{ torch: !isFlashOn }],
        })
        setIsFlashOn(!isFlashOn)
      }
    } catch (err) {
      console.error("Erro ao controlar flash:", err)
    }
  }

  const switchCamera = () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user"
    setFacingMode(newFacingMode)

    if (isScanning) {
      stopCamera()
      setTimeout(() => {
        startCamera()
      }, 100)
    }
  }

  const resetScan = () => {
    setScanResult(null)
    setError(null)
    if (!isScanning) {
      startCamera()
    }
  }

  const handleReferralAction = (result: ScanResult) => {
    if (result.type === "referral" && result.referralCode) {
      // Simular processo de indicação
      alert(`Código de indicação detectado: ${result.referralCode}\n\nVocê será redirecionado para o cadastro!`)
      window.open(result.data, "_blank")
    } else if (result.type === "url") {
      window.open(result.data, "_blank")
    }
  }

  const testVibration = (type: "success" | "referral" | "error") => {
    triggerVibration(type)
  }

  const updateVibrationSettings = (updates: Partial<VibrationSettings>) => {
    setVibrationSettings((prev) => ({ ...prev, ...updates }))
  }

  useEffect(() => {
    if (isOpen && !hasPermission) {
      startCamera()
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
      }
    }
  }, [isOpen])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Scan className="h-5 w-5 text-blue-400" />
            <h2 className="text-white font-semibold">Scanner QR Code</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-400 hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Configurações de Vibração */}
        {showSettings && (
          <div className="p-4 border-b border-gray-700 bg-gray-800/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasVibrationSupport ? (
                    <Vibrate className="h-4 w-4 text-purple-400" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="text-white text-sm font-medium">Vibração</span>
                  {!hasVibrationSupport && <Badge className="bg-gray-600 text-xs">Não suportado</Badge>}
                </div>
                <Switch
                  checked={vibrationSettings.enabled && hasVibrationSupport}
                  onCheckedChange={(enabled) => updateVibrationSettings({ enabled })}
                  disabled={!hasVibrationSupport}
                />
              </div>

              {vibrationSettings.enabled && hasVibrationSupport && (
                <>
                  <div>
                    <label className="text-gray-300 text-xs mb-2 block">Intensidade</label>
                    <div className="flex gap-2">
                      {(["light", "medium", "strong"] as const).map((intensity) => (
                        <Button
                          key={intensity}
                          variant={vibrationSettings.intensity === intensity ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateVibrationSettings({ intensity })}
                          className={`text-xs ${
                            vibrationSettings.intensity === intensity
                              ? "bg-purple-600 hover:bg-purple-700 text-white"
                              : "border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700"
                          }`}
                        >
                          {intensity === "light" ? "Leve" : intensity === "medium" ? "Médio" : "Forte"}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 text-xs mb-2 block">Testar Padrões</label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testVibration("success")}
                        className="border-green-600 text-green-400 bg-transparent hover:bg-green-600/20 text-xs"
                      >
                        Sucesso
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testVibration("referral")}
                        className="border-purple-600 text-purple-400 bg-transparent hover:bg-purple-600/20 text-xs"
                      >
                        Indicação
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testVibration("error")}
                        className="border-red-600 text-red-400 bg-transparent hover:bg-red-600/20 text-xs"
                      >
                        Erro
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Camera View */}
        <div className="relative aspect-square bg-black">
          {hasPermission === null && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm">Iniciando câmera...</p>
              </div>
            </div>
          )}

          {hasPermission === false && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="text-center text-white">
                <CameraOff className="h-12 w-12 mx-auto mb-3 text-red-400" />
                <p className="text-sm mb-3">{error}</p>
                <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Tentar Novamente
                </Button>
              </div>
            </div>
          )}

          {hasPermission && (
            <>
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

              {/* Overlay de scanning */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Frame de scanning */}
                  <div className="w-48 h-48 border-2 border-blue-400 relative">
                    {/* Cantos do frame */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400"></div>

                    {/* Linha de scanning animada */}
                    {isScanning && (
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="w-full h-0.5 bg-blue-400 animate-pulse absolute top-1/2 transform -translate-y-1/2"></div>
                      </div>
                    )}

                    {/* Indicador de vibração */}
                    {vibrationSettings.enabled && hasVibrationSupport && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-purple-600 text-white text-xs flex items-center gap-1">
                          <Vibrate className="h-3 w-3" />
                          Vibração
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <Badge className={`${isScanning ? "bg-blue-600" : "bg-gray-600"} text-white text-xs`}>
                      {isScanning ? "Escaneando..." : "Pausado"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Controles da câmera */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {supportedConstraints?.torch && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFlash}
                    className="bg-black/50 border-gray-600 text-white hover:bg-black/70"
                  >
                    {isFlashOn ? <FlashlightOff className="h-4 w-4" /> : <Flashlight className="h-4 w-4" />}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={switchCamera}
                  className="bg-black/50 border-gray-600 text-white hover:bg-black/70"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {/* Canvas oculto para processamento */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Resultado do scan */}
        {scanResult && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-start gap-3">
              {scanResult.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-medium text-sm">
                    {scanResult.type === "referral"
                      ? "Código de Indicação"
                      : scanResult.type === "url"
                        ? "Link Detectado"
                        : "Texto"}
                  </span>
                  <Badge
                    className={`text-xs ${
                      scanResult.type === "referral"
                        ? "bg-purple-600 text-white"
                        : scanResult.type === "url"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-600 text-white"
                    }`}
                  >
                    {scanResult.type === "referral" ? "Indicação" : scanResult.type === "url" ? "URL" : "Texto"}
                  </Badge>
                  {vibrationSettings.enabled && hasVibrationSupport && (
                    <Badge className="bg-purple-600/20 text-purple-400 text-xs flex items-center gap-1">
                      <Vibrate className="h-2 w-2" />
                      Vibrou
                    </Badge>
                  )}
                </div>

                {scanResult.type === "referral" && scanResult.referralCode && (
                  <div className="mb-3">
                    <p className="text-gray-300 text-xs mb-1">Código encontrado:</p>
                    <p className="text-white font-mono text-sm bg-gray-800 px-2 py-1 rounded">
                      {scanResult.referralCode}
                    </p>
                  </div>
                )}

                <p className="text-gray-400 text-xs mb-3 break-all">{scanResult.data}</p>

                <div className="flex gap-2">
                  {scanResult.isValid && (
                    <Button
                      onClick={() => handleReferralAction(scanResult)}
                      className={`text-xs ${
                        scanResult.type === "referral"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white`}
                    >
                      {scanResult.type === "referral" ? (
                        <>
                          <Users className="h-3 w-3 mr-1" />
                          Usar Código
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Abrir Link
                        </>
                      )}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={resetScan}
                    className="border-gray-600 text-gray-300 bg-transparent hover:bg-gray-700 text-xs"
                  >
                    Escanear Novamente
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instruções */}
        {!scanResult && hasPermission && (
          <div className="p-4 border-t border-gray-700">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-2">Posicione o QR Code dentro do quadro</p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span>• Mantenha estável</span>
                <span>• Boa iluminação</span>
                <span>• Distância adequada</span>
              </div>
              {vibrationSettings.enabled && hasVibrationSupport && (
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-purple-400">
                  <Vibrate className="h-3 w-3" />
                  <span>Vibração ativada</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
