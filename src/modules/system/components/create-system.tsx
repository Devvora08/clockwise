'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createSystemSchema, createSystemSchemaType } from '../form-schema'
import { createSystem } from '@/actions/systems/createSystem'

import {
  Dialog, DialogContent, DialogTrigger,
  DialogTitle, DialogDescription
} from '@/components/ui/dialog'
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormDescription, FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ShieldEllipsis, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

const CreateSystemDialog = ({ triggerText }: { triggerText?: string }) => {
  const [open, setOpen] = useState(false)
  const router = useRouter();

  const form = useForm<createSystemSchemaType>({
    resolver: zodResolver(createSystemSchema),
    defaultValues: {
      name: '',
      
      latitude: 0,
      longitude: 0,
      address: '', 
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createSystem,
    onSuccess: (data) => {
      toast.success('System created successfully', { id: 'create-system' })
      form.reset()
      setOpen(false)
      router.push(`/system/${data.id}`)
    },
    onError: (error) => {
      toast.error(error.message)
      form.reset();
    },
  })

  const onSubmit = async (values: createSystemSchemaType) => {
    const getLocation = (): Promise<GeolocationPosition> =>
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

    try {
      const position = await getLocation()
      const { latitude, longitude } = position.coords

      mutate({
        ...values,
        latitude,
        longitude,
      })
    } catch (error) {
      toast.error('Location access denied or unavailable', { id: 'create-system' })
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText ?? 'Create System'}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <DialogTitle className="flex items-center gap-2">
          <ShieldEllipsis className="text-primary" />
          <span>Create New System</span>
        </DialogTitle>
        <DialogDescription>
          Enter system name and passkey.
        </DialogDescription>
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>This will identify the system.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Passkey Field */}
              <FormField
                control={form.control}
                name="passkey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passkey</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1234"
                        min={1000}
                        max={9999}
                        {...field}
                        value={isNaN(field.value) ? '' : field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormDescription>Enter a 4-digit passkey.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Field (Editable) */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter the address for the system's location"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-4" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : 'Create System'}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateSystemDialog
