import { Product } from "@/lib/types";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";

export function ProductSpecifications({ product }: { product: Product }) {
    // Define fields to show
    const specs = [
        { label: "Producer", value: product.producer?.name },
        { label: "Code", value: product.code },
        { label: "Manufacturer Code", value: product.man_code }, // Ensure this field exists in types/API or allow any
        { label: "EAN", value: (product as any).ean_code || "-" }, // Type assertion if field missing in interface
        { label: "Weight", value: `${product.weight} kg` },
        { label: "Dimensions (W x H x D)", value: `${product.width || 0} x ${product.height || 0} x ${product.depth || 0} cm` },
        { label: "Delivery Price", value: `${product.delivery_price} ${product.currency}` },
        { label: "Execution Time", value: product.execution_time },
        { label: "Min Order Qty", value: `${product.min_qty} ${product.uom}` },
    ];

    return (
        <Table>
            <TableBody>
                {specs.map((spec) => (
                    product && spec.value && (spec.value !== "0" && spec.value !== "0 x 0 x 0 cm" && spec.value !== "-") ? (
                        <TableRow key={spec.label}>
                            <TableCell className="font-medium w-1/3">{spec.label}</TableCell>
                            <TableCell>{spec.value}</TableCell>
                        </TableRow>
                    ) : null
                ))}
            </TableBody>
        </Table>
    );
}
