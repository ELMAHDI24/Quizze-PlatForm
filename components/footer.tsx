export function Footer() {
  return (
    <footer className="border-t bg-slate-50 mt-auto">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} QuizMaster. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
