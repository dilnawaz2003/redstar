import app from './app.js';
import ENV from './config/env.js';
import globalErrorHandlerMiddleware from './middlewares/globalErrorMiddlware.js';
import AppRoutes from './routes/index.js';

app.use("/api/v1",AppRoutes);
app.use(globalErrorHandlerMiddleware)

const PORT = ENV.PORT;
app.listen(PORT,() => {
    console.log("App Listning on port :",PORT)
})
