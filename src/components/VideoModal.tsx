interface Props {
  src: string
  title: string
  onClose: () => void
}

export function VideoModal({ src, title, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={`${import.meta.env.BASE_URL}videos/${src}`}
          controls
          autoPlay
          playsInline
          className="w-full rounded-t-2xl"
        />
        <div className="flex items-center justify-between p-3">
          <span className="font-medium text-white">{title}</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-800 px-4 py-2 text-sm font-medium text-white active:bg-zinc-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
