'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from "@/src/lib/prisma"
import { OrderIdSchema } from "@/src/schema"

export async function completeOrder(formaData: FormData) {
    // Otra manera de obtener el id del formulario
    // const orderId = formaData.get('order_id')!

    const data = {
        orderId: formaData.get('order_id')
    }

    const result = OrderIdSchema.safeParse(data)

    if (result.success) {
        try {
            await prisma.order.update({
                where: {
                    id: result.data.orderId
                },
                data: {
                    status: true,
                    orderReadyAt: new Date(Date.now())
                }
            })
            revalidatePath('/admin/orders')
        } catch (error) {
            console.log(error)
        }
    }

}