export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Términos y Condiciones</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Última actualización: {new Date().toLocaleDateString('es-CL')}
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Aceptación de términos</h2>
            <p className="text-gray-700">
              Al acceder y utilizar Ruta Local (Santiago), aceptas estar sujeto a estos términos y condiciones.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Uso del servicio</h2>
            <p className="text-gray-700">
              Ruta Local es una plataforma para descubrir emprendimientos locales en Santiago.
              Te comprometes a utilizar el servicio de manera responsable y legal.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Cuenta de usuario</h2>
            <p className="text-gray-700">
              Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.
              Debes notificarnos inmediatamente de cualquier uso no autorizado.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Contenido</h2>
            <p className="text-gray-700">
              El contenido proporcionado en la plataforma es solo para fines informativos.
              Nos reservamos el derecho de modificar o eliminar contenido sin previo aviso.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
