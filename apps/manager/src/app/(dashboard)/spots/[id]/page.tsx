import { redirect } from 'next/navigation';

export default async function SpotDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    redirect(`/spots/${id}/info`);
}
