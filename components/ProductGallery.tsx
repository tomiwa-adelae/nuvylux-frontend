import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface Props{
    open: boolean,
    closeModal: () => void
    images: string[]
    thumbnail: string
}

export const ProductGallery = ({open, closeModal, images, thumbnail}:Props) => {
  return (
    <Dialog open={open} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Gallery</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {/* Include the thumbnail in the full gallery too */}
            <div className="relative aspect-square">
              <Image
                src={thumbnail}
                alt="Thumbnail"
                fill
                className="object-cover rounded-lg border"
              />
            </div>
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square">
                <Image
                  src={img}
                  alt={`Gallery image ${idx + 1}`}
                  fill
                  className="object-cover rounded-lg border"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
  )
}
