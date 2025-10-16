"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, LogOut, UserCircle, Calendar, Map } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(currentUser))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  const handleEnroll = () => {
    router.push("/enroll")
  }

  const handleViewMap = () => {
    router.push("/map")
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Portal de Inscripciones</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <UserCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Bienvenido, {user.firstName}!</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Estado:</span>
                {user.enrolled ? (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Inscrito
                  </Badge>
                ) : (
                  <Badge variant="secondary">Pendiente de inscripción</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-primary" />
                Mapa del Parque
              </CardTitle>
              <CardDescription>Explora las actividades y puntos de interés del parque natural</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleViewMap} variant="outline" className="w-full bg-transparent" size="lg">
                <Map className="h-4 w-4 mr-2" />
                Ver mapa interactivo
              </Button>
            </CardContent>
          </Card>

          {user.enrolled ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Inscripción completada
                </CardTitle>
                <CardDescription>Tu inscripción ha sido procesada exitosamente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-secondary p-4 space-y-2">
                  <h3 className="font-semibold">Detalles de inscripción</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Nombre:</span> {user.firstName} {user.lastName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Email:</span> {user.email}
                    </p>
                    {user.enrollmentData && (
                      <>
                        <p>
                          <span className="text-muted-foreground">Teléfono:</span> {user.enrollmentData.phone}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Curso:</span> {user.enrollmentData.course}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Fecha:</span>{" "}
                          {new Date(user.enrollmentData.enrolledAt).toLocaleDateString("es-ES")}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Completa tu inscripción
                </CardTitle>
                <CardDescription>Para finalizar el proceso, completa el formulario de inscripción</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleEnroll} className="w-full" size="lg">
                  Inscribirme ahora
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
