// Código QR único por especie (HU-06). Apunta a la ficha completa de la especie.
import { QRCodeSVG } from 'qrcode.react';

export const urlEspecie = (slug) => `${window.location.origin}/especies/${slug}`;

export default function QREspecie({ especie, tamano = 112 }) {
  return (
    <figure className="qr-especie mb-0">
      <QRCodeSVG value={urlEspecie(especie.slug)} size={tamano} level="M" marginSize={2}
        title={`Código QR de la historia de ${especie.nombre}`} role="img" aria-label={`Código QR que abre la historia de ${especie.nombre}`} />
      <figcaption className="small text-secondary">Escanéame</figcaption>
    </figure>
  );
}
