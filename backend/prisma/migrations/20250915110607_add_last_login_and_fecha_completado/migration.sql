/*
  Warnings:

  - You are about to drop the column `completed` on the `tareas` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `tareas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."tareas" DROP COLUMN "completed",
DROP COLUMN "priority",
ADD COLUMN     "completada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "prioridad" "public"."Prioridad" NOT NULL DEFAULT 'MEDIA';
