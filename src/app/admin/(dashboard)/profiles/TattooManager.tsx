import Image from "next/image";
import { addTattoo, deleteTattoo } from "@/app/admin/actions";
import { MugshotPlaceholder } from "@/components/MugshotPlaceholder";

export function TattooManager({
  profileId,
  tattoos,
}: {
  profileId: string;
  tattoos: {
    id: string;
    imageId: string | null;
    bodyLocation: string | null;
    meaning: string | null;
  }[];
}) {
  const addAction = addTattoo.bind(null, profileId);

  return (
    <div className="space-y-4">
      {tattoos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {tattoos.map((t) => (
            <div
              key={t.id}
              className="rounded-lg border border-border bg-surface overflow-hidden"
            >
              <div className="aspect-square relative bg-surface-raised">
                {t.imageId ? (
                  <Image
                    src={`/api/images/${t.imageId}`}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                ) : (
                  <MugshotPlaceholder className="w-full h-full" />
                )}
              </div>
              <div className="p-2 font-record text-xs space-y-1">
                {t.bodyLocation && (
                  <p className="font-semibold">{t.bodyLocation}</p>
                )}
                {t.meaning && <p className="text-muted">{t.meaning}</p>}
                <form action={deleteTattoo.bind(null, t.id, profileId)}>
                  <button type="submit" className="btn-danger">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <form
        action={addAction}
        className="rounded-lg border border-dashed border-border p-4 space-y-3"
      >
        <p className="text-xs uppercase tracking-wide text-muted font-record">
          Add tattoo / marking
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            name="bodyLocation"
            placeholder="Body location"
            className="field-input"
          />
          <input
            name="meaning"
            placeholder="Meaning / description"
            className="field-input"
          />
        </div>
        <input type="file" name="image" accept="image/*" className="field-input" />
        <button type="submit" className="btn-secondary">
          Add
        </button>
      </form>
    </div>
  );
}
