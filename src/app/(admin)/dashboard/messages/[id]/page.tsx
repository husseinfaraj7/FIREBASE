'use client';

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Reply,
  Archive,
  Trash2,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

import {
  useFirestore,
  useUser,
  useMemoFirebase,
  useDoc,
} from "@/firebase";
import { doc } from "firebase/firestore";
import type { ContactMessage, Car } from "@/types";
import {
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from "@/firebase/non-blocking-updates";

// ✅ Proper message detail page
export default function MessageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();

  // --- Redirect non-logged-in users ---
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace(`/login?from=/dashboard/messages/${id}`);
    }
  }, [isUserLoading, user, router, id]);

  // --- Message reference ---
  const messageRef = useMemoFirebase(() => {
    if (!firestore || !id) return undefined;
    return doc(firestore, "contact_messages", id);
  }, [firestore, id]);

  const { data: message, isLoading: isMessageLoading } =
    useDoc<ContactMessage>(messageRef);

  // --- Car reference (if linked) ---
  const carRef = useMemoFirebase(() => {
    if (!firestore || !message?.carId) return null;
    return doc(firestore, "cars", message.carId);
  }, [firestore, message?.carId]);
  const { data: car } = useDoc<Car>(carRef);

  // --- Mark message as read once loaded ---
  useEffect(() => {
    if (message && message.status === "new" && messageRef) {
      updateDocumentNonBlocking(messageRef, { status: "read" });
    }
  }, [message, messageRef]);

  // --- Handle message updates ---
  const handleStatusChange = (status: ContactMessage["status"]) => {
    if (!messageRef) return;
    updateDocumentNonBlocking(messageRef, { status });
    toast({
      title: "Stato aggiornato",
      description: `Messaggio segnato come ${status}.`,
    });
    if (status === "archived") {
      router.push("/dashboard/messages");
    }
  };

  const handleDelete = async () => {
    if (!messageRef) return;
    deleteDocumentNonBlocking(messageRef);
    toast({
      title: "Messaggio eliminato",
      description: "Il messaggio è stato eliminato con successo.",
    });
    router.push("/dashboard/messages");
  };

  // --- Loading state ---
  if (isUserLoading || isMessageLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="ml-2 text-sm text-muted-foreground">
          Caricamento messaggio...
        </p>
      </div>
    );
  }

  // --- Access guards ---
  if (!user) return null;

  if (!message) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center text-muted-foreground">
        <p>Messaggio non trovato.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/messages">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna ai messaggi
          </Link>
        </Button>
      </div>
    );
  }

  const formattedDate = message.createdAt
    ? new Date(message.createdAt.seconds * 1000).toLocaleString("it-IT")
    : "N/A";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard/messages">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Torna ai messaggi</span>
          </Link>
        </Button>

        <h1 className="text-xl font-semibold truncate">
          {message.subject || `Messaggio da ${message.name}`}
        </h1>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange("archived")}
          >
            <Archive className="mr-2 h-4 w-4" /> Archivia
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Elimina
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Questa azione non può essere annullata. Il messaggio sarà
                  eliminato definitivamente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Elimina
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>{message.name}</CardTitle>
              <CardDescription>
                <a
                  href={`mailto:${message.email}`}
                  className="hover:underline"
                >
                  {message.email}
                </a>
                {message.phone && <span> &middot; {message.phone}</span>}
              </CardDescription>
            </div>
            <div className="text-left sm:text-right">
              <time className="text-sm text-muted-foreground">
                {formattedDate}
              </time>
              <div className="mt-1">
                <Badge>{message.status}</Badge>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          {car && (
            <p className="text-sm text-muted-foreground">
              Relativo a:{" "}
              <Link
                href={`/autolist/${car.id}`}
                className="font-semibold text-foreground hover:underline"
              >
                {car.make} {car.model}
              </Link>
            </p>
          )}
        </CardHeader>

        <CardContent>
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {message.message}
          </p>
        </CardContent>

        <CardFooter className="flex-col sm:flex-row gap-2">
          <Button asChild className="w-full sm:w-auto">
            <a
              href={`mailto:${message.email}?subject=RE: ${
                message.subject || "La tua richiesta a MiniCar"
              }`}
            >
              <Reply className="mr-2 h-4 w-4" /> Rispondi via Email
            </a>
          </Button>
          {message.status !== "replied" && (
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => handleStatusChange("replied")}
            >
              <Reply className="mr-2 h-4 w-4" /> Segna come Risposto
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
