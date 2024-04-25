package fetch.support;

import sun.misc.Unsafe;

import java.lang.reflect.Field;

public abstract class UnsafeUtils {
    private static final Unsafe UNSAFE;

    static {
        try {
            Field theUnsafe = Unsafe.class.getDeclaredField("theUnsafe");
            theUnsafe.setAccessible(true);
            UNSAFE = (Unsafe) theUnsafe.get(null);
        } catch (IllegalAccessException | NoSuchFieldException | SecurityException e) {
            throw new ExceptionInInitializerError("Cannot access Unsafe");
        }
    }

    public static Unsafe getUnsafe() {
        return UNSAFE;
    }

}
