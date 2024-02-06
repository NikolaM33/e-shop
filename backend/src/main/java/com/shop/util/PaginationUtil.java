package com.shop.util;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;

public class PaginationUtil {
    public static final String NUMBER_OF_ELEMENTS_HEADER = "X-number-of-elements";
    public static final String TOTAL_PAGES_HEADER = "X-total-pages";
    public static final String TOTAL_ELEMENTS_HEADER = "X-total-elements";
    public static final String PAGE_NUMBER_HEADER = "X-page-number";

    public static <T> HttpHeaders getPageResponseHeaders(Page<T> page) {
        HttpHeaders pageResponseHeaders = new HttpHeaders();
        pageResponseHeaders.add(PAGE_NUMBER_HEADER, String.valueOf(page.getNumber()));
        pageResponseHeaders.add(TOTAL_PAGES_HEADER, String.valueOf(page.getTotalPages()));
        pageResponseHeaders.add(NUMBER_OF_ELEMENTS_HEADER, String.valueOf(page.getNumberOfElements()));
        pageResponseHeaders.add(TOTAL_ELEMENTS_HEADER, String.valueOf(page.getTotalElements()));
        return pageResponseHeaders;
    }

}
