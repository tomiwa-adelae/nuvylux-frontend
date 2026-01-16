import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NairaIcon } from "@/components/NairaIcon";
import { formatMoneyInput } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { IconShoppingBag } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types";

export const OrderCard = ({ order }: { order: Order }) => {
  return (
    <Card className="gap-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-1.5">
          <div className="flex items-center justify-start gap-1.5">
            <IconShoppingBag /> {order?.orderNumber}
          </div>
          <Badge
            variant={order.status === "PENDING" ? "outline" : "default"}
            className="capitalize"
          >
            {order.status.toLowerCase()}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {order.items.map((item: any) => (
          <div
            key={item.id}
            className="flex gap-4 items-center border rounded-xl overflow-hidden"
          >
            <div className="relative size-24 rounded-tl-xl rounded-bl-xl shrink-0  overflow-hidden bg-gray-100 border">
              <Image
                src={item.productImage}
                alt={item.productName}
                fill
                className="object-cover size-full aspect-auto"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">
                {item.productName}
              </h4>
              <p className="text-xs text-muted-foreground">
                <NairaIcon /> {formatMoneyInput(Number(item.price))} ×{" "}
                {item.quantity}
              </p>
              <div className="flex gap-2 mt-1">
                {item.size && (
                  <Badge variant="secondary">Size {item.size}</Badge>
                )}
                {item.color && <Badge variant="secondary">{item.color}</Badge>}
              </div>
            </div>
          </div>
        ))}
        <div className="my-4">
          <Separator />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              Total Amount
            </p>
            <p className="text-lg font-bold">
              <NairaIcon /> {formatMoneyInput(Number(order.total))}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/orders/${order.orderNumber}`}>Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
