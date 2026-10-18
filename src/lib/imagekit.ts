// ImageKit hosts event posters and gallery images only. Payment proofs live in the private Supabase Storage bucket
// (see src/lib/payment-proofs.ts).
import ImageKit from 'imagekit';

let client: ImageKit | null = null;

// The SDK throws when keys are missing, so construct it on first use rather than at module load.
// Otherwise `next build` fails while collecting page data for routes that import this module.
function getImageKit(): ImageKit {
  if (!client) {
    client = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
    });
  }
  return client;
}

export const imagekit = new Proxy({} as ImageKit, {
  get(_target, prop) {
    const instance = getImageKit();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});
