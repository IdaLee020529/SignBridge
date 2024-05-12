import navbarTranslations from "./navbar";
import loginTranslations from "./login";
import signupTranslations from "./signup";
import footerTranslations from "./footer";
import homepageTranslations from './homepage';
import datasetCollectionTranslations from './dataset_collection';
import feedbackTranslations from "./feedback";
import educationTranslations from "./education";
import faqTransaction from "./faq";
import notificationTransaction from "./notification";

const resources = {
    en: {
        translation: {
            ...navbarTranslations.en,
            ...loginTranslations.en,
            ...signupTranslations.en,
            ...footerTranslations.en,
            ...homepageTranslations.en,
            ...datasetCollectionTranslations.en,
            ...feedbackTranslations.en,
            ...educationTranslations.en,
            ...faqTransaction.en,
            ...notificationTransaction.en,
        },
    },
    bm: {
        translation: {
            ...navbarTranslations.bm,
            ...loginTranslations.bm,
            ...signupTranslations.bm,
            ...footerTranslations.bm,
            ...homepageTranslations.bm,
            ...datasetCollectionTranslations.bm,
            ...feedbackTranslations.bm,
            ...educationTranslations.bm,
            ...faqTransaction.bm,
            ...notificationTransaction.bm,
        },
    },
};

export default resources;
