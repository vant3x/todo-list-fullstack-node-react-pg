/*
  Warnings:

  - You are about to drop the `_EtiquetaToTarea` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_EtiquetaToTarea" DROP CONSTRAINT "_EtiquetaToTarea_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_EtiquetaToTarea" DROP CONSTRAINT "_EtiquetaToTarea_B_fkey";

-- DropTable
DROP TABLE "public"."_EtiquetaToTarea";

-- CreateTable
CREATE TABLE "public"."tarea_etiquetas" (
    "tarea_id" TEXT NOT NULL,
    "etiqueta_id" TEXT NOT NULL,

    CONSTRAINT "tarea_etiquetas_pkey" PRIMARY KEY ("tarea_id","etiqueta_id")
);

-- AddForeignKey
ALTER TABLE "public"."tarea_etiquetas" ADD CONSTRAINT "tarea_etiquetas_tarea_id_fkey" FOREIGN KEY ("tarea_id") REFERENCES "public"."tareas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tarea_etiquetas" ADD CONSTRAINT "tarea_etiquetas_etiqueta_id_fkey" FOREIGN KEY ("etiqueta_id") REFERENCES "public"."etiquetas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
