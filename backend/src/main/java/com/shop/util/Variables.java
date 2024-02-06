package com.shop.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class Variables {

    @Value("${spring.profiles.active}")
    public String springEnvValue;

//    @Value("${document.files.path}")
//    private String filesPathValue;
//
//    @Value("${cloud.aws.credentials.access-key}")
//    private String awsAccessKeyValue;
//
//    @Value("${cloud.aws.credentials.secret-key}")
//    private String awsSecretKeyValue;

    public static String filesPath;
    public static String awsAccessKey;
    public static String awsSecretKey;
    public static String springEnv;

    public Variables() {
    }

    @PostConstruct
    private void setValues() {
//        filesPath = filesPathValue;
//        awsAccessKey = awsAccessKeyValue;
//        awsSecretKey = awsSecretKeyValue;
        springEnv = springEnvValue;
    }
}
