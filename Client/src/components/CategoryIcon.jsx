import { LayoutGrid, CookingPot, Home, Flower2, Wrench, Sparkles, SprayCan, Gem } from 'lucide-react';

const iconMap = {
  todos: LayoutGrid,
  cozinha: CookingPot,
  casa: Home,
  jardim: Flower2,
  utilidades: Wrench,
  beleza: Sparkles,
  limpeza: SprayCan,
  'achados-premium': Gem,
};

const fallback = LayoutGrid;

export default function CategoryIcon({ slug, size = 16 }) {
  const Icon = iconMap[slug] || fallback;
  return <Icon size={size} strokeWidth={1.75} />;
}
