import ProductDetailClient from './ProductDetailClient';

export function generateStaticParams() {
  return [{ id: 'placeholder' }]; // We generate a placeholder static page for routing rewrites
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ProductDetailClient params={params} />;
}
