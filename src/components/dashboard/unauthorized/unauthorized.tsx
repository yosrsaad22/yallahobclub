// app/unauthorized/page.tsx
export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Accès refusé</h1>
        <p className="text-gray-600">Tu n’as pas les permissions pour voir cette page.</p>
      </div>
    </div>
  );
}
