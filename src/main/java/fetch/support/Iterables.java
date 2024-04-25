package fetch.support;

import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.Objects;
import java.util.function.Function;

public abstract class Iterables {

    public static <T, I> Iterable<T> map(Iterable<I> iterable, Function<I, Iterable<T>> mapper) {
        Objects.requireNonNull(iterable, "iterable must be not null");
        Objects.requireNonNull(iterable, "mapper must be not null");
        return () -> {
            var iterator = iterable.iterator();
            return new Iterator<>() {

                private Iterator<T> delegate = Collections.emptyIterator();

                @Override
                public boolean hasNext() {
                    while (!this.delegate.hasNext() && iterator.hasNext()) {
                        this.delegate = mapper.apply(iterator.next()).iterator();
                    }
                    return this.delegate.hasNext();
                }

                @Override
                public T next() {
                    return this.delegate.next();
                }
            };
        };
    }

    @SafeVarargs
    public static <T> Iterable<T> compose(Iterable<T>... iterable) {
        Objects.requireNonNull(iterable, "iterable must be not null");
        return () -> {
            var iterator = Arrays.stream(iterable).iterator();
            return new Iterator<>() {

                private Iterator<T> delegate = Collections.emptyIterator();

                @Override
                public boolean hasNext() {
                    while (!this.delegate.hasNext() && iterator.hasNext()) {
                        this.delegate = iterator.next().iterator();
                    }
                    return this.delegate.hasNext();
                }

                @Override
                public T next() {
                    return this.delegate.next();
                }
            };
        };
    }
}