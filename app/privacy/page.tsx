export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidad</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Última actualización: {new Date().toLocaleDateString('es-CL')}
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Información que recopilamos</h2>
            <p className="text-gray-700">
              Recopilamos información que nos proporcionas directamente, como tu nombre, email y
              preferencias cuando creas una cuenta en Ruta Local.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Uso de la información</h2>
            <p className="text-gray-700">
              Utilizamos tu información para proporcionar, mantener y mejorar nuestros servicios,
              así como para comunicarnos contigo sobre actualizaciones y nuevas funcionalidades.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Protección de datos</h2>
            <p className="text-gray-700">
              Implementamos medidas de seguridad diseñadas para proteger tu información personal
              contra acceso no autorizado y uso indebido.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Compartir información</h2>
            <p className="text-gray-700">
              No vendemos ni compartimos tu información personal con terceros, excepto cuando sea
              necesario para proporcionar nuestros servicios o cuando la ley lo requiera.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Tus derechos</h2>
            <p className="text-gray-700">
              Tienes derecho a acceder, corregir o eliminar tu información personal.
              Puedes contactarnos en cualquier momento para ejercer estos derechos.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
