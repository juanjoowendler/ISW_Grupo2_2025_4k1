"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function EnrollPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    phone: "",
    course: "",
    comments: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }
    const userData = JSON.parse(currentUser)
    setUser(userData)

    if (userData.enrolled) {
      router.push("/dashboard")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.phone || !formData.course) {
      setError("Por favor completa todos los campos obligatorios")
      setLoading(false)
      return
    }

    // Actualizar usuario
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((u: any) => {
      if (u.id === user.id) {
        return {
          ...u,
          enrolled: true,
          enrollmentData: {
            phone: formData.phone,
            course: formData.course,
            comments: formData.comments,
            enrolledAt: new Date().toISOString(),
          },
        }
      }
      return u
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))

    const updatedUser = updatedUsers.find((u: any) => u.id === user.id)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Formulario de inscripción</CardTitle>
            <CardDescription>Completa los siguientes datos para finalizar tu inscripción</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="rounded-lg bg-secondary/50 p-4 space-y-1">
                <p className="text-sm font-medium">Información de cuenta</p>
                <p className="text-sm text-muted-foreground">
                  {user.firstName} {user.lastName} • {user.email}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Teléfono <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+34 600 000 000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">
                  Curso de interés <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) => setFormData({ ...formData, course: value })}
                  disabled={loading}
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Selecciona un curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-development">Desarrollo Web Full Stack</SelectItem>
                    <SelectItem value="data-science">Ciencia de Datos</SelectItem>
                    <SelectItem value="mobile-dev">Desarrollo Mobile</SelectItem>
                    <SelectItem value="ui-ux">Diseño UI/UX</SelectItem>
                    <SelectItem value="devops">DevOps y Cloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Comentarios adicionales</Label>
                <Textarea
                  id="comments"
                  placeholder="¿Tienes alguna pregunta o comentario?"
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  disabled={loading}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Procesando inscripción..." : "Completar inscripción"}
              </Button>
            </CardContent>
          </form>
        </Card>
      </main>
    </div>
  )
}
