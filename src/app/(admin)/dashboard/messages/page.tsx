'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Archive,
  Trash2,
  MailOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, doc, writeBatch, Query } from "firebase/firestore";
import { deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { contactMessageConverter } from "@/firebase/converters/contactMessageConverter";
import type { ContactMessage } from "@/types";

// ---------- Constants ----------

const PAGE_SIZE = 10;

const statusVariant = {
  new: "default",
  read: "secondary",
  replied: "outline",
  archived: "outline",
} as const;

// ---------- Component ----------

export default function AdminMessagesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(0);

  // --- Firestore collection reference (typed) ---
  const messagesRef = useMemoFirebase(() => {
    if (!firestore) return undefined;
    return collection(firestore, "contact_messages")
      .withConverter(contactMessageConverter) as Query<ContactMessage>;
  }, [firestore]);

  const { data: messages, isLoading: isMessagesLoading } =
    useCollection<ContactMessage>(messagesRef);

  // --- Redirect non-logged-in users ---
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/login?from=/dashboard/messages");
    }
  }, [isUserLoading, user, router]);

  // --- Update message status ---
  const updateMessageStatus = (id: string, status: ContactMessage["status"]) => {
    if (!firestore) return;
    const docRef = doc(firestore, "contact_messages", id);
    updateDocumentNonBlocking(docRef, { status });
    toast({ title: "Stato del messaggio aggiornato." });
  };

  // --- Bulk update or delete ---
  const handleBulkAction = async (status: ContactMessage["status"] | "delete") => {
    if (!firestore || selectedIds.length === 0) return;

    const batch = writeBatch(firestore);
    selectedIds.forEach((id) => {
      const docRef = doc(firestore, "contact_messages", id);
      if (status === "delete") {
        batch.delete(docRef);
      } else {
        batch.update(docRef, { status });
      }
    });

    try {
      await batch.commit();
      toast({
        title: "Azione completata",
        description: `${selectedIds.length} messaggi aggiornati.`,
      });
      setSelectedIds([]);
    } catch (error) {
      console.error("Errore azione batch:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile completare l'azione.",
      });
    }
  };

  // --- Loading state ---
  if (isUserLoading || isMessagesLoading) {
    return <div>Caricamento messaggi...</div>;
  }

  if (!user) return null;

  // --- Filter & paginate messages ---
  const filteredMessages =
    messages?.filter((msg) => {
      if (statusFilter === "all") return msg.status !== "archived";
      return msg.status === statusFilter;
    }) || [];

  const paginatedMessages = filteredMessages.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  const totalPages = Math.ceil(filteredMessages.length / PAGE_SIZE);

  // ---------- RENDER ----------

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messaggi Ricevuti</h1>

      <Tabs defaultValue="all" onValueChange={(val) => setStatusFilter(val)}>
        <TabsList>
          <TabsTrigger value="all">Attivi</TabsTrigger>
          <TabsTrigger value="new">Nuovi</TabsTrigger>
          <TabsTrigger value="read">Letti</TabsTrigger>
          <TabsTrigger value="replied">Risposti</TabsTrigger>
          <TabsTrigger value="archived">Archiviati</TabsTrigger>
        </TabsList>
      </Tabs>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Azioni su {selectedIds.length} messaggi
                <MoreHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleBulkAction("read")}>
                <MailOpen className="mr-2 h-4 w-4" />
                Segna come letti
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction("archived")}>
                <Archive className="mr-2 h-4 w-4" />
                Archivia
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleBulkAction("delete")}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Elimina
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      selectedIds.length === paginatedMessages.length &&
                      paginatedMessages.length > 0
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIds(paginatedMessages.map((msg) => msg.id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Auto</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead>
                  <span className="sr-only">Azioni</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMessages.map((msg) => (
                <TableRow
                  key={msg.id}
                  className={msg.status === "new" ? "bg-secondary" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(msg.id)}
                      onCheckedChange={(checked) => {
                        setSelectedIds((prev) =>
                          checked
                            ? [...prev, msg.id]
                            : prev.filter((id) => id !== msg.id)
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/messages/${msg.id}`}
                      className="hover:underline"
                    >
                      <div className="font-medium">{msg.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {msg.email}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {msg.carId || "Generale"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        statusVariant[msg.status as keyof typeof statusVariant] ||
                        "secondary"
                      }
                    >
                      {msg.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {msg.createdAt
                      ? new Date(msg.createdAt.seconds * 1000).toLocaleDateString(
                          "it-IT"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/messages/${msg.id}`}>
                            <MailOpen className="mr-2 h-4 w-4" /> Leggi
                          </Link>
                        </DropdownMenuItem>
                        {msg.status !== "read" && (
                          <DropdownMenuItem
                            onClick={() => updateMessageStatus(msg.id, "read")}
                          >
                            <MailOpen className="mr-2 h-4 w-4" /> Segna come letto
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => updateMessageStatus(msg.id, "archived")}
                        >
                          <Archive className="mr-2 h-4 w-4" /> Archivia
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-destructive"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Elimina
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Questa azione non può essere annullata.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annulla</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteDocumentNonBlocking(
                                    doc(firestore, "contact_messages", msg.id)
                                  )
                                }
                              >
                                Elimina
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              />
            </PaginationItem>
            <PaginationItem className="hidden sm:block text-sm text-muted-foreground">
              Pagina {page + 1} di {totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
