"use client";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FolderList from "@/components/folder-list";
// API'ye kullanıcı durumu güncellemeye yönelik fonksiyon
const updateUserStatus = async (email: string, status: boolean) => {
  const response = await fetch("/api/update-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, status }),
  });

  const result = await response.json();

  if (result.success) {
    console.log("Kullanıcı durumu güncellendi!");
  } else {
    console.error("Hata:", result.message);
  }
};

const UserTableStatus = () => {
  const [users, setUsers] = useState<any[]>([]); // API'den gelen kullanıcılar
  const [dbUsers, setDbUsers] = useState<any[]>([]); // Veritabanından gelen kullanıcılar
  const [combinedUsers, setCombinedUsers] = useState<any[]>([]); // Birleştirilmiş kullanıcılar
  const [loading, setLoading] = useState(true); // loading state'i
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // Seçilen kullanıcı id'si

  const columns: { key: string; label: string }[] = [
    { key: "lastupdate", label: "Güncelleme Zamanı" },
    { key: "mail", label: "Email" },
    { key: "displayName", label: "İsim" },
    { key: "role", label: "Durum" },
    { key: "status", label: "Oto Yedekle" },
    { key: "action", label: "Aksiyon" },
  ];
  const handleRowClick = (userId: string) => {
    setSelectedUserId(userId); // Tıklanan satırdaki kullanıcıyı seçiyoruz
  };

  // Veritabanındaki kullanıcıları al
  useEffect(() => {
    const fetchDbUsers = async () => {
      try {
        const response = await fetch("/api/dbusers"); // Veritabanından kullanıcıları alıyoruz
        const data = await response.json();

        console.log("Database Users:", data); // Veritabanı kullanıcılarını kontrol et

        if (data.data && Array.isArray(data.data)) {
          setDbUsers(data.data); // Veritabanındaki kullanıcıları state'e set ediyoruz
        } else {
          console.error("No valid data in database response.");
        }
      } catch (error) {
        console.error("Error fetching database users:", error);
      }
    };

    fetchDbUsers();
  }, []); // Veritabanı kullanıcılarını ilk renderda al

  // API kullanıcı verilerini al
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();

        console.log("API response data:", data); // API yanıtını konsola yazdırarak kontrol et

        if (data && Array.isArray(data)) {
          // API'den gelen veriyi kullanıcıları işleyelim
          setUsers(
            data.map((user: any) => ({
              id: user.id,
              email: user.mail,
              title: user.displayName,
              role: "", // Boş bırakıyoruz
              status: "", // Boş bırakıyoruz
            }))
          );
        } else {
          console.error("No valid data in API response.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // API'den kullanıcı verisini al

  // Kullanıcıları birleştir ve doğru rolü ata
  useEffect(() => {
    const combineUsers = () => {
      // 1. API'den gelen kullanıcıları kontrol et
      const combinedData = users.map((user: any) => {
        // Veritabanında var mı kontrol et
        const dbUser = dbUsers.find(
          (dbUser: any) => dbUser.mail === user.email
        );

        if (!dbUser) {
          // Eğer veritabanında yoksa, "Yeni" rolü ve "status: false" ekle
          return { ...user, role: "Yeni", status: false };
        }

        // Eğer veritabanında varsa, "Aktif Değil" rolü ve dbUser.status ile status ayarla
        return { ...user, role: dbUser.role, status: dbUser.status };
      });

      // 2. Veritabanında olup API'de olmayan kullanıcıları ekle
      const dbOnlyUsers = dbUsers
        .filter(
          (dbUser: any) =>
            !users.some((user: any) => user.email === dbUser.mail) // API'de olmayanları al
        )
        .map((user: any) => ({
          id: user._id, // Veritabanından gelen verilerde id farklı olabilir
          email: user.mail,
          title: user.displayName,
          role: "Aktif Değil",
          status: user.status, // db'den gelen 'status' kullan
          lastupdate: user.createdAt, // lastupdate alanını ekleyelim
        }));

      // 3. Hem API'den gelen hem de veritabanındaki kullanıcıları birleştir
      setCombinedUsers([...combinedData, ...dbOnlyUsers]);
    };

    if (users.length > 0 && dbUsers.length > 0) {
      combineUsers();
    }
  }, [users, dbUsers]); // Kullanıcılar değiştikçe bu effect tetiklenecek

  // Switch durumu değiştiğinde status'u güncelle
  const handleSwitchChange = async (email: string, checked: boolean) => {
    // Switch durumu değiştiğinde kullanıcı verisini güncelle
    setCombinedUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.email === email ? { ...user, status: checked } : user
      )
    );

    try {
      // API'ye istek gönder
      const response = await fetch("/api/statusupdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, status: checked }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Kullanıcı durumu başarıyla güncellendi!");
      } else {
        console.error("Hata:", result.message);
      }
    } catch (error) {
      console.error("API isteği sırasında bir hata oluştu:", error);
    }
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {combinedUsers.length > 0 ? (
            combinedUsers.map((item: any) => (
              <TableRow key={item.email} className="hover:bg-default-100">
                <TableCell className="font-medium text-card-foreground/80">
                  <div className="flex gap-3 items-center">
                    {item.lastupdate ? item.lastupdate : "Yeni"}
                  </div>
                </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <Badge
                    variant="soft"
                    color={
                      (item.role === "Yeni" && "info") ||
                      (item.role === "Aktif Değil" && "warning") ||
                      "default"
                    }
                    className="capitalize"
                  >
                    {item.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={item.status} // 'item.status' ile Switch'in durumu kontrol ediliyor
                    onCheckedChange={(checked) => {
                      handleSwitchChange(item.email, checked);
                    }}
                  />
                </TableCell>
                <TableCell className="flex gap-3 justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Detaylar</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Detaylar</DialogTitle>
                        <DialogDescription>
                          Make changes to your profile here. Click save when
                          you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4"></div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                  >
                    <Icon icon="heroicons:eye" className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    color="secondary"
                  >
                    <Icon icon="heroicons:trash" className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {selectedUserId && (
        <Dialog
          open={Boolean(selectedUserId)}
          onOpenChange={() => setSelectedUserId(null)}
        >
          <DialogTrigger asChild>
            <Button variant="outline">Klasörleri Görüntüle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kullanıcı Klasörleri</DialogTitle>
            </DialogHeader>
            {/* FolderList bileşenini burada gösteriyoruz */}
            <FolderList userId={selectedUserId} />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default UserTableStatus;
