-- DropForeignKey
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_task_id_fkey";

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
