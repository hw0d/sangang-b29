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
    <div className="space-y-3">
      {tattoos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {tattoos.map((t) => (
            <div key={t.id}>
              <div className="win-card-thumb aspect-square">
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
              <div className="text-xs mt-1 space-y-1">
                {t.bodyLocation && <p className="font-bold">{t.bodyLocation}</p>}
                {t.meaning && <p className="win-card-meta">{t.meaning}</p>}
                <form action={deleteTattoo.bind(null, t.id, profileId)}>
                  <button type="submit">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <fieldset>
        <legend>Add tattoo / marking</legend>
        <form action={addAction} className="field-row-stacked">
          <div className="grid sm:grid-cols-2 gap-3">
            <input type="text" name="bodyLocation" placeholder="Body location" />
            <input type="text" name="meaning" placeholder="Meaning / description" />
          </div>
          <input type="file" name="image" accept="image/*" />
          <button type="submit">Add</button>
        </form>
      </fieldset>
    </div>
  );
}
