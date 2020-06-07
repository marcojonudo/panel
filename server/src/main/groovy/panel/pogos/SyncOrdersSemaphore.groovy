package panel.pogos

import groovy.transform.CompileStatic

import java.util.concurrent.Semaphore

@CompileStatic
class SyncOrdersSemaphore {

    private final static int ASYNC_THREADS = 1

    private static Semaphore semaphore

    static void create() {
        semaphore = new Semaphore(ASYNC_THREADS)
    }

    static boolean trySyncOrders() {
        return semaphore.tryAcquire()
    }

    static void waitUntilUnlocked() {
        semaphore.acquire()
        semaphore.release()
    }

    static void release() {
        semaphore.release()
    }

}
