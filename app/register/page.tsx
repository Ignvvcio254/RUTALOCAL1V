"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)
  const { register, isLoading } = useAuth()
  const { toast } = useToast()

  // Validación de fortaleza de contraseña
  const passwordStrength = (pass: string) => {
    let strength = 0
    if (pass.length >= 8) strength++
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++
    if (/\d/.test(pass)) strength++
    if (/[^a-zA-Z0-9]/.test(pass)) strength++
    return strength
  }

  const strength = passwordStrength(password)
  const strengthLabels = ["Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"]
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    if (!email.includes("@")) {
      toast({
        title: "Email inválido",
        description: "Por favor ingresa un email válido",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Contraseña muy corta",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Por favor verifica que las contraseñas sean iguales",
        variant: "destructive",
      })
      return
    }

    if (!acceptTerms) {
      toast({
        title: "Términos y condiciones",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive",
      })
      return
    }

    try {
      await register({
        name,
        email,
        password,
        passwordConfirm: confirmPassword,
      })
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al crear tu cuenta",
        variant: "destructive",
      })
    }
  }

  const handleGoogleSignup = async () => {
    console.log('🚀 [Register Page] Click en botón Google Register');
    setIsOAuthLoading(true);

    try {
      console.log('🔧 [Register Page] Importando OAuthService...');
      const { OAuthService } = await import('@/lib/auth/oauth.service');

      console.log('🔐 [Register Page] Llamando a OAuthService.loginWithGoogle()...');
      console.log('💡 [Register Page] Nota: Google Auth no diferencia login/registro - Supabase maneja ambos casos');

      await OAuthService.loginWithGoogle();

      console.log('✅ [Register Page] OAuthService.loginWithGoogle() completado');
      // Supabase redirigirá automáticamente a Google
      // El callback determinará si es usuario nuevo (registro) o existente (login)
    } catch (error) {
      console.error('❌ [Register Page] Error en Google Auth:', error);
      toast({
        title: "Error al registrarse con Google",
        description: error instanceof Error ? error.message : "No se pudo conectar con Google",
        variant: "destructive",
      });
      setIsOAuthLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg hover:shadow-xl transition-shadow">
            <span className="text-white font-bold text-2xl">SG</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Únete a RutaGo</h1>
          <p className="text-gray-600 mt-2">Crea tu cuenta y comienza tu aventura</p>
        </div>

        {/* Register Card */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
            <CardDescription className="text-center">
              Regístrate para descubrir Santiago auténtico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Google Signup Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-2 hover:bg-gray-50"
                onClick={handleGoogleSignup}
                disabled={isLoading || isOAuthLoading}
              >
                {isOAuthLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Conectando con Google...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Registrarse con Google
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O regístrate con email</span>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i < strength ? strengthColors[strength] : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">
                      Fortaleza: <span className="font-medium">{strengthLabels[strength]}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && password === confirmPassword && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Las contraseñas coinciden
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                  Acepto los{" "}
                  <Link href="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    términos y condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    política de privacidad
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear Cuenta"
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">¿Ya tienes una cuenta? </span>
              <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Inicia sesión
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Development Note */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            <span className="font-semibold">💡 Modo desarrollo:</span>
            <span>Acepta cualquier dato por ahora</span>
          </div>
        </div>
      </div>
    </div>
  )
}
