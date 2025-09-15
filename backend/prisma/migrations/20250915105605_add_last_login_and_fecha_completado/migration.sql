/*
  Warnings:

  - You are about to drop the column `completada` on the `tareas` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `tareas` table. All the data in the column will be lost.
  - You are about to drop the column `prioridad` on the `tareas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."tareas" DROP COLUMN "completada",
DROP COLUMN "descripcion",
DROP COLUMN "prioridad",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "fecha_completado" TIMESTAMP(3),
ADD COLUMN     "priority" "public"."Prioridad" NOT NULL DEFAULT 'BAJA';

-- AlterTable
ALTER TABLE "public"."usuarios" ADD COLUMN     "last_login" TIMESTAMP(3);
