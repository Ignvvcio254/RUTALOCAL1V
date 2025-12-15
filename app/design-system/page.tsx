"use client"

import * as React from "react"
import { Search, MapPin, Heart, ChevronRight, Sparkles } from "lucide-react"
import {
  RutaButton,
  RutaBadge,
  VerificadoBadge,
  NuevoBadge,
  PopularBadge,
  CerradoBadge,
  AbiertoBadge,
  RutaInput,
  SearchInput,
  RutaTextarea,
  FloatingInput,
  RutaCard,
  ImageCard,
  HorizontalCard,
  CardContent,
  RatingDisplay,
  InteractiveRating,
  RutaAvatar,
  AvatarGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ToastProvider,
  useToast,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
} from "@/components/ruta"

function DesignSystemContent() {
  const [searchValue, setSearchValue] = React.useState("")
  const [textareaValue, setTextareaValue] = React.useState("")
  const [rating, setRating] = React.useState(3)
  const [modalOpen, setModalOpen] = React.useState(false)
  const { addToast } = useToast()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">RutaGo Design System</h1>
          <p className="mt-2 text-lg text-gray-600">Componentes reutilizables para la plataforma de turismo local</p>
        </header>

        {/* Buttons Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Botones</h2>
          <RutaCard>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500">Variantes</h3>
                <div className="flex flex-wrap gap-3">
                  <RutaButton variant="primary">Primary</RutaButton>
                  <RutaButton variant="secondary">Secondary</RutaButton>
                  <RutaButton variant="ghost">Ghost</RutaButton>
                  <RutaButton variant="success">Success</RutaButton>
                  <RutaButton variant="destructive">Destructive</RutaButton>
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500">Tamaños</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <RutaButton size="sm">Small</RutaButton>
                  <RutaButton size="md">Medium</RutaButton>
                  <RutaButton size="lg">Large</RutaButton>
                  <RutaButton size="xl">Extra Large</RutaButton>
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500">Con iconos y estados</h3>
                <div className="flex flex-wrap gap-3">
                  <RutaButton leftIcon={<MapPin />}>Explorar Mapa</RutaButton>
                  <RutaButton rightIcon={<ChevronRight />}>Ver Más</RutaButton>
                  <RutaButton isLoading>Cargando</RutaButton>
                  <RutaButton disabled>Disabled</RutaButton>
                  <RutaButton size="icon">
                    <Heart />
                  </RutaButton>
                </div>
              </div>
            </CardContent>
          </RutaCard>
        </section>

        {/* Badges Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Badges</h2>
          <RutaCard>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500">Variantes</h3>
                <div className="flex flex-wrap gap-2">
                  <RutaBadge>Default</RutaBadge>
                  <RutaBadge variant="success">Success</RutaBadge>
                  <RutaBadge variant="warning">Warning</RutaBadge>
                  <RutaBadge variant="error">Error</RutaBadge>
                  <RutaBadge variant="info">Info</RutaBadge>
                  <RutaBadge variant="purple">Purple</RutaBadge>
                  <RutaBadge variant="indigo">Indigo</RutaBadge>
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500">Presets y tamaños</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <VerificadoBadge />
                  <NuevoBadge />
                  <PopularBadge />
                  <AbiertoBadge />
                  <CerradoBadge />
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500">Tamaños y formas</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <RutaBadge size="sm" variant="indigo">
                    Small
                  </RutaBadge>
                  <RutaBadge size="md" variant="indigo">
                    Medium
                  </RutaBadge>
                  <RutaBadge size="lg" variant="indigo">
                    Large
                  </RutaBadge>
                  <RutaBadge shape="pill" variant="purple">
                    Pill Shape
                  </RutaBadge>
                  <RutaBadge icon={<Sparkles className="size-3" />} variant="success">
                    Con icono
                  </RutaBadge>
                </div>
              </div>
            </CardContent>
          </RutaCard>
        </section>

        {/* Inputs Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Inputs</h2>
          <RutaCard>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-gray-500">Input básico con iconos</h3>
                  <RutaInput placeholder="Buscar experiencias..." leftIcon={<Search />} />
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-medium text-gray-500">Input con error</h3>
                  <RutaInput placeholder="Email" error="El email no es válido" defaultValue="correo@invalido" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-gray-500">Search con clear</h3>
                  <SearchInput
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onClear={() => setSearchValue("")}
                    searchIcon={<Search />}
                    placeholder="Buscar negocios..."
                  />
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-medium text-gray-500">Floating label</h3>
                  <FloatingInput label="Nombre completo" />
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500">Textarea con contador</h3>
                <RutaTextarea
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  placeholder="Escribe tu reseña..."
                  maxLength={500}
                  showCount
                />
              </div>
            </CardContent>
          </RutaCard>
        </section>

        {/* Cards Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Cards</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-500">Card interactiva</h3>
              <RutaCard interactive className="p-4">
                <p className="font-medium">Card con hover effect</p>
                <p className="mt-1 text-sm text-gray-500">Haz click o hover para ver el efecto</p>
              </RutaCard>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-500">Image Card</h3>
              <ImageCard
                src="/cozy-coffee-shop.png"
                alt="Café local"
                overlay={
                  <div className="text-white">
                    <p className="font-semibold">Café del Barrio</p>
                    <p className="text-sm opacity-90">Providencia</p>
                  </div>
                }
              />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-500">Horizontal Card</h3>
              <HorizontalCard imageSrc="/vibrant-art-gallery.png" imageAlt="Galería">
                <p className="font-medium">Galería de Arte</p>
                <p className="text-sm text-gray-500">Bellas Artes</p>
                <div className="mt-2">
                  <RatingDisplay rating={4.5} size="sm" />
                </div>
              </HorizontalCard>
            </div>
          </div>
        </section>

        {/* Ratings Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Ratings</h2>
          <RutaCard>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500">Rating display (solo lectura)</h3>
                <div className="flex flex-wrap gap-6">
                  <RatingDisplay rating={4.5} size="sm" />
                  <RatingDisplay rating={4.5} size="md" reviewCount={128} />
                  <RatingDisplay rating={3.5} size="lg" reviewCount={42} />
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500">Rating interactivo</h3>
                <InteractiveRating value={rating} onChange={setRating} size="lg" />
                <p className="mt-2 text-sm text-gray-500">Tu calificación: {rating} estrellas</p>
              </div>
            </CardContent>
          </RutaCard>
        </section>

        {/* Avatars Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Avatars</h2>
          <RutaCard>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500">Tamaños</h3>
                <div className="flex items-center gap-3">
                  <RutaAvatar size="xs" fallback="ML" />
                  <RutaAvatar size="sm" fallback="ML" />
                  <RutaAvatar size="md" fallback="María L" />
                  <RutaAvatar size="lg" fallback="Juan P" />
                  <RutaAvatar size="xl" src="/thoughtful-artist.png" alt="Usuario" />
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500">Con estado</h3>
                <div className="flex items-center gap-3">
                  <RutaAvatar size="lg" fallback="ML" status="online" />
                  <RutaAvatar size="lg" fallback="JP" status="away" />
                  <RutaAvatar size="lg" fallback="CR" status="busy" />
                  <RutaAvatar size="lg" fallback="AN" status="offline" />
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-500">Avatar Group</h3>
                <AvatarGroup
                  size="md"
                  max={4}
                  avatars={[
                    { fallback: "ML" },
                    { fallback: "JP" },
                    { fallback: "CR" },
                    { fallback: "AN" },
                    { fallback: "BE" },
                    { fallback: "DF" },
                  ]}
                />
              </div>
            </CardContent>
          </RutaCard>
        </section>

        {/* Modal Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Modal</h2>
          <RutaCard>
            <CardContent>
              <RutaButton onClick={() => setModalOpen(true)}>Abrir Modal</RutaButton>
              <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <ModalHeader onClose={() => setModalOpen(false)}>Confirmar Reserva</ModalHeader>
                <ModalBody>
                  <p className="text-gray-600">
                    Estás a punto de reservar una experiencia en &quot;Café del Barrio&quot;. La reserva será para 2
                    personas el día 15 de enero a las 14:00 hrs.
                  </p>
                  <div className="mt-4 rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <RutaAvatar fallback="CB" />
                      <div>
                        <p className="font-medium">Café del Barrio</p>
                        <RatingDisplay rating={4.8} size="sm" />
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <RutaButton variant="ghost" onClick={() => setModalOpen(false)}>
                    Cancelar
                  </RutaButton>
                  <RutaButton onClick={() => setModalOpen(false)}>Confirmar</RutaButton>
                </ModalFooter>
              </Modal>
            </CardContent>
          </RutaCard>
        </section>

        {/* Toast Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Toasts</h2>
          <RutaCard>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <RutaButton
                  variant="success"
                  onClick={() =>
                    addToast({
                      title: "Reserva confirmada",
                      description: "Tu experiencia ha sido reservada exitosamente.",
                      variant: "success",
                    })
                  }
                >
                  Success Toast
                </RutaButton>
                <RutaButton
                  variant="destructive"
                  onClick={() =>
                    addToast({
                      title: "Error al reservar",
                      description: "Hubo un problema con tu reserva.",
                      variant: "error",
                    })
                  }
                >
                  Error Toast
                </RutaButton>
                <RutaButton
                  variant="secondary"
                  onClick={() =>
                    addToast({
                      title: "Atención",
                      description: "Tu sesión expirará en 5 minutos.",
                      variant: "warning",
                    })
                  }
                >
                  Warning Toast
                </RutaButton>
                <RutaButton
                  variant="ghost"
                  onClick={() =>
                    addToast({
                      title: "Nueva actualización",
                      description: "Hay nuevas experiencias disponibles.",
                      variant: "info",
                    })
                  }
                >
                  Info Toast
                </RutaButton>
              </div>
            </CardContent>
          </RutaCard>
        </section>

        {/* Skeleton Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Skeletons</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <RutaCard>
              <CardContent>
                <h3 className="mb-3 text-sm font-medium text-gray-500">Texto skeleton</h3>
                <SkeletonText lines={3} />
              </CardContent>
            </RutaCard>
            <RutaCard>
              <CardContent>
                <h3 className="mb-3 text-sm font-medium text-gray-500">Avatar y texto</h3>
                <div className="flex items-center gap-3">
                  <SkeletonAvatar size={48} />
                  <div className="flex-1 space-y-2">
                    <Skeleton height={14} className="w-1/2" />
                    <Skeleton height={12} className="w-1/3" />
                  </div>
                </div>
              </CardContent>
            </RutaCard>
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-500">Card skeleton</h3>
              <SkeletonCard />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function DesignSystemPage() {
  return (
    <ToastProvider position="top-right">
      <DesignSystemContent />
    </ToastProvider>
  )
}
