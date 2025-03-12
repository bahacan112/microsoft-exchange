import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Shadcn Dialog component
import { Button } from "@/components/ui/button"; // Shadcn Button component

const UserFolders = ({ userId }: { userId: string }) => {
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/folders?userId=${userId}`);
        const data = await response.json();
        setFolders(data); // Klasör verilerini state'e set et
      } catch (error) {
        console.error("Klasörler alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [userId]);

  return (
    <div>
      <h2>Klasörler</h2>
      {loading && <p>Veriler yükleniyor...</p>}
      <ul>
        {folders.map((folder) => (
          <Dialog key={folder._id}>
            <DialogTrigger asChild>
              <Button variant="outline">{folder.displayName}</Button>{" "}
              {/* Her bir klasör adı için bir buton */}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{folder.displayName} Detayları</DialogTitle>
                <DialogDescription>
                  Bu klasörde {folder.mailCount} e-posta bulunmaktadır.
                </DialogDescription>
              </DialogHeader>
              <p>Diğer klasör bilgileri burada olabilir...</p>
            </DialogContent>
          </Dialog>
        ))}
      </ul>
      {folders.length === 0 && !loading && (
        <p>Bu kullanıcıya ait klasör bulunamadı.</p>
      )}
    </div>
  );
};

export default UserFolders;
