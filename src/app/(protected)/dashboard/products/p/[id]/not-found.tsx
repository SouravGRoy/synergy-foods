import { GeneralShell } from "@/components/globals/layouts";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <GeneralShell>
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
                <h1 className="text-4xl font-bold">404</h1>
                <h2 className="text-2xl font-semibold">Product Not Found</h2>
                <p className="max-w-md text-muted-foreground">
                    The product you're looking for doesn't exist or may have
                    been deleted.
                </p>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/dashboard/products">Back to Products</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/products/create">
                            Create New Product
                        </Link>
                    </Button>
                </div>
            </div>
        </GeneralShell>
    );
}
