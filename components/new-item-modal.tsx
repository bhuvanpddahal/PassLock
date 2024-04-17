"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "./ui/form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "./ui/dialog";
import {
    CreateItemPayload,
    CreateItemValidator
} from "@/lib/validators/item";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { createItem } from "@/actions/item";
import { useNewItem } from "@/hooks/use-new-item-modal";

const NewItemModal = () => {
    const queryClient = useQueryClient();
    const { isOpen, close } = useNewItem();
    const [isLoading, startTransition] = useTransition();

    const form = useForm<CreateItemPayload>({
        resolver: zodResolver(CreateItemValidator),
        defaultValues: {
            siteName: "",
            siteLink: "",
            siteIcon: undefined,
            email: "",
            password: "",
            favorited: false
        }
    });

    const onSubmit = (payload: CreateItemPayload) => {
        startTransition(() => {
            createItem(payload).then((data) => {
                if (data?.error) {
                    toast.error(data.error);
                }
                if (data?.success) {
                    form.reset();
                    toast.success(data.success);
                    queryClient.invalidateQueries({
                        queryKey: ["dashboard"]
                    });
                    close();
                }
            }).catch(() => {
                toast.error("Something went wrong");
            });
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="sm:max-w-[525px] w-full">
                <DialogHeader>
                    <DialogTitle>New Item</DialogTitle>
                    <DialogDescription>
                        Create a new item to store in PassLock. Don't worry, you can edit the values at anytime.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full"
                    >
                        <div className='flex flex-col gap-y-4'>
                            <FormField
                                control={form.control}
                                name="siteName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <h3>Site Name</h3>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="siteLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <h3>Site Link</h3>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                disabled={isLoading}
                                            />
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
                                        <FormLabel>
                                            <h3>Email</h3>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <h3>Password</h3>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="favorited"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between">
                                        <FormLabel>
                                            <h3>Favorite</h3>
                                        </FormLabel>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="border-yellow-400 focus:ring-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-zinc-100"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="gap-y-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={close}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    isLoading={isLoading}
                                >
                                    {isLoading ? "Creating" : "Create"}
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};

export default NewItemModal;