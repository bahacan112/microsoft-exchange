import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog"; // Shadcn-ui Modal bileşeni
import { Button } from "@/components/ui/button";
interface User {
  id: string;
  displayName: string;
}

interface Folder {
  id: string;
  displayName: string;
  mailCount: number; // Alt klasördeki e-posta sayısı
}

interface UserListProps {
  users: User[];
  getUserFolders: (userId: string) => Promise<Folder[]>;
}

const UserList: React.FC<UserListProps> = ({ users, getUserFolders }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);

  const handleUserClick = async (user: User) => {
    setSelectedUser(user);
    try {
      const folders = await getUserFolders(user.id);
      setFolders(folders);
      setIsModalOpen(true); // Modal'ı aç
    } catch (error) {
      console.error("Klasörler alınırken bir hata oluştu:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFolders([]);
  };

  return (
    <div>
      <h2>Kullanıcı Listesi</h2>
      <div>
        {users.map((user) => (
          <Button
            key={user.id}
            onClick={() => handleUserClick(user)}
            className="mb-2"
          >
            {user.displayName}
          </Button>
        ))}
      </div>

      {/* Modal Box */}
      {selectedUser && (
        <Dialog>
          <DialogHeader>
            {selectedUser.displayName} Klasör Bilgileri
          </DialogHeader>
          <DialogContent>
            {folders.length === 0 ? (
              <p>Bu kullanıcının hiç klasörü yok.</p>
            ) : (
              <>
                <p>Toplam Klasör Sayısı: {folders.length}</p>
                <ul>
                  {folders.map((folder) => (
                    <li key={folder.id}>
                      {folder.displayName}: {folder.mailCount} e-posta
                    </li>
                  ))}
                </ul>
              </>
            )}
          </DialogContent>
          <DialogFooter>
            <Button onClick={handleCloseModal}>Kapat</Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
};

export default UserList;
