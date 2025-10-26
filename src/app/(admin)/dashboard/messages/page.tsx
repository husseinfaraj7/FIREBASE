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

const PAGE_SIZE = 10;

const statusVariant = {
  new: "default",
  read: "secondary",
  replied: "outline",
  archived: "outline",
} as const;

export default function AdminMessagesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(0);

  const messagesRef = useMemoFirebase(() => {
    if (!firestore) return undefined;
    return collection(firestore, "contact_messages").withConverter(
      contactMessageConverter,
    ) as Query<ContactMessage>;
  }, [firestore]);

  const { data: messages, isLoading: isMessagesLoading } =
    useCollection<ContactMessage>(messagesRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/login?from=/dashboard/messages");
    }
  }, [isUserLoading, user, router]);

  const updateMessageStatus = (id: string, status: ContactMessage["status"]) => {
    if (!firestore) return;
    const docRef = doc(firestore, "contact_messages", id);
    updateDocumentNonBlocking(docRef, { status });
    toast({ title: "Stato del messaggio aggiornato." });
  };

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

  if (isUserLoading || isMessagesLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Caricamento messaggi...
      </div>
    );
  }

  if (!user) return null;

  const filteredMessages =
    messages?.filter((msg) => {
      if (statusFilter === "all") return msg.status !== "archived";
      return msg.status === statusFilter;
    }) || [];

  const paginatedMessages = filteredMessages.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );

  const totalPages = Math.ceil(filteredMessages.length / PAGE_SIZE);

  return (
    <main className="bg-muted/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Comunicazioni</p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Messaggi ricevuti</h1>
              <p className="text-sm text-muted-foreground">
                Filtra, aggiorna lo stato o elimina le richieste inviate dal sito.
              </p>
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="all"
          onValueChange={(val) => {
            setStatusFilter(val);
            setPage(0);
          }}
          className="w-full"
        >
          <TabsList className="flex flex-wrap gap-2 rounded-full border bg-muted/40 p-1">
            <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-background">
              Attivi
            </TabsTrigger>
            <TabsTrigger value="new" className="rounded-full data-[state=active]:bg-background">
              Nuovi
            </TabsTrigger>
            <TabsTrigger value="read" className="rounded-full data-[state=active]:bg-background">
              Letti
            </TabsTrigger>
            <TabsTrigger value="replied" className="rounded-full data-[state=active]:bg-background">
              Risposti
            </TabsTrigger>
            <TabsTrigger value="archived" className="rounded-full data-[state=active]:bg-background">
              Archiviati
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-none bg-transparent font-medium">
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

        <Card className="border bg-card shadow-sm">
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
                      aria-label="Seleziona tutti i messaggi visibili"
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
                    className={`transition-colors ${msg.status === "new" ? "bg-muted/40" : "hover:bg-muted/30"}`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(msg.id)}
                        onCheckedChange={(checked) => {
                          setSelectedIds((prev) =>
                            checked ? [...prev, msg.id] : prev.filter((id) => id !== msg.id),
                          );
                        }}
                        aria-label={`Seleziona il messaggio da ${msg.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/messages/${msg.id}`} className="hover:underline">
                        <div className="font-medium">{msg.name}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">{msg.email}</div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{msg.carId || "Generale"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariant[msg.status as keyof typeof statusVariant] || "secondary"}
                        className="capitalize"
                      >
                        {msg.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {msg.createdAt
                        ? new Date(msg.createdAt.seconds * 1000).toLocaleDateString("it-IT")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="hover:bg-muted">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Azioni sul messaggio</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/messages/${msg.id}`}>
                              <MailOpen className="mr-2 h-4 w-4" /> Leggi
                            </Link>
                          </DropdownMenuItem>
                          {msg.status !== "read" && (
                            <DropdownMenuItem onClick={() => updateMessageStatus(msg.id, "read")}>
                              <MailOpen className="mr-2 h-4 w-4" /> Segna come letto
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => updateMessageStatus(msg.id, "archived")}>
                            <Archive className="mr-2 h-4 w-4" /> Archivia
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-destructive"
                                onSelect={(event) => event.preventDefault()}
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
                                      doc(firestore, "contact_messages", msg.id),
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
                {paginatedMessages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                      Nessun messaggio corrisponde al filtro selezionato.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage((p) => Math.max(0, p - 1))} />
              </PaginationItem>
              <PaginationItem className="hidden sm:block text-sm text-muted-foreground">
                Pagina {page + 1} di {totalPages}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </main>
  );
}
