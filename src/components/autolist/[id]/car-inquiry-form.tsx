'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { addDocumentNonBlocking, useFirestore, useUser } from "@/firebase"
import { collection, serverTimestamp } from "firebase/firestore"

const formSchema = z.object({
  name: z.string().min(2, "Il nome è obbligatorio").max(50),
  email: z.string().email("Inserisci un'email valida"),
  phone: z.string().optional(),
  message: z.string().min(10, "Il messaggio deve contenere almeno 10 caratteri."),
})

type CarInquiryFormProps = {
  carId: string
}

export function CarInquiryForm({ carId }: CarInquiryFormProps) {
  const { toast } = useToast()
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      phone: "",
      message: "Sono interessato/a a questa vettura. Vorrei ricevere maggiori informazioni.",
    },
  })
  
  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
     if (!firestore) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile connettersi al database.",
      });
      return;
    }
    
    const messagesCollection = collection(firestore, "contact_messages");
    
    try {
      addDocumentNonBlocking(messagesCollection, {
        ...values,
        carId,
        userId: user?.uid,
        status: "new",
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Messaggio Inviato!",
        description: "Grazie per il tuo interesse. Ti risponderemo al più presto.",
      });
      form.reset();
    } catch (error) {
      console.error("Error sending message: ", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Qualcosa è andato storto.",
        description: "Non è stato possibile inviare il tuo messaggio. Riprova più tardi.",
      });
    }
  }

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Contattaci per questa auto</CardTitle>
        <CardDescription>Compila il modulo per ricevere maggiori informazioni.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Il tuo nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="latua@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefono (Opzionale)</FormLabel>
                  <FormControl>
                    <Input placeholder="Il tuo numero di telefono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Messaggio</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting || !firestore}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Invio in corso..." : "Invia Richiesta"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
