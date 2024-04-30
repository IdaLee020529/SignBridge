import React, { useState, useEffect } from "react";
import styles from "./FaqAdmin.module.css";
import * as Accordion from "@radix-ui/react-accordion";
import classNames from "classnames";
import { ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import {
    FetchFaq,
    CreateFaq,
    DeleteFaq,
    UpdateFaq,
} from "../../../services/faq.service";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import InputField from "../../../components/InputField/InputField";

interface FaqData {
    question: string;
    answer: string;
    faq_id: number;
}

interface AccordionTriggerProps
    extends React.ComponentPropsWithoutRef<typeof Accordion.Trigger> {
    children: React.ReactNode;
    className?: string;
}

interface AccordionContentProps
    extends React.ComponentPropsWithoutRef<typeof Accordion.Content> {
    children: React.ReactNode;
    className?: string;
}

export default function FaqAdmin() {
    const [faqs, setFaqs] = useState<FaqData[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [openUpdate, setOpenUpdate] = useState(false);
    const [faq, setFaq] = useState<FaqData | null>(null);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [faqToDelete, setFaqToDelete] = useState<number | null>(null);

    const AccordionDemo = ({ faqs }: { faqs: FaqData[] }) => (
        <Accordion.Root
            className={styles.AccordionRoot}
            type="single"
            collapsible
        >
            {faqs.map((faq) => (
                <Accordion.Item
                    className={styles.AccordionItem}
                    value={faq.faq_id.toString()}
                    key={faq.faq_id}
                >
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                        {faq.answer}
                        <div className={styles.buttonsContainer}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFaq(faq);
                                    setOpenUpdate(true);
                                }}
                                className={styles.updateFaqButton}
                            >
                                <FontAwesomeIcon icon={faEdit} />
                            </button>

                            <button
                                onClick={(e) => {
                                    setFaqToDelete(faq.faq_id);
                                    setOpenDeleteConfirm(true);
                                }}
                                className={styles.dltFaqButton}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </AccordionContent>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );

    const AccordionTrigger = React.forwardRef<
        HTMLButtonElement,
        AccordionTriggerProps
    >(({ children, className, ...props }, forwardedRef) => (
        <Accordion.Header className={styles.AccordionHeader}>
            <Accordion.Trigger
                className={classNames(styles.AccordionTrigger, className)}
                {...props}
                ref={forwardedRef}
            >
                {children}
                <ChevronDownIcon
                    className={styles.AccordionChevron}
                    aria-hidden
                />
            </Accordion.Trigger>
        </Accordion.Header>
    ));

    const AccordionContent = React.forwardRef<
        HTMLDivElement,
        AccordionContentProps
    >(({ children, className, ...props }, forwardedRef) => (
        <Accordion.Content
            className={classNames(styles.AccordionContent, className)}
            {...props}
            ref={forwardedRef}
        >
            <div className={styles.AccordionContentText}>{children}</div>
        </Accordion.Content>
    ));

    const getFaqs = async () => {
        try {
            const { data } = await FetchFaq();
            setFaqs(data);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFaqs();
    }, []);

    useEffect(() => {
        if (!open) {
            setQuestion("");
            setAnswer("");
        }
    }, [open]);

    if (loading) {
        return <p>Loading FAQs...</p>;
    }

    async function addFaq(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!question.trim() || !answer.trim()) {
            toast.error("Both question and answer fields are required.");
            return;
        }

        try {
            await CreateFaq({ question, answer });
            toast.success("FAQ created successfully");
            await getFaqs();
        } catch (error) {
            toast.error("Error creating FAQ");
        } finally {
            setOpen(false);
            setQuestion("");
            setAnswer("");
        }
    }

    const confirmDeleteFaq = async () => {
        if (faqToDelete === null) return;
        try {
            await DeleteFaq(faqToDelete);
            toast.success("FAQ deleted successfully");
            await getFaqs();
        } catch (error) {
            toast.error("Error deleting FAQ");
        } finally {
            setOpenDeleteConfirm(false);
            setFaqToDelete(null);
        }
    };

    async function updateFaq(
        e: React.FormEvent<HTMLFormElement>,
        faq_id: number | undefined
    ) {
        e.preventDefault();

        if (!faq_id) return;

        const form = e.target as HTMLFormElement;
        const question = form.question.value;
        const answer = form.answer.value;

        if (!question.trim() || !answer.trim()) {
            toast.error("Both question and answer fields are required.");
            return;
        }

        try {
            await UpdateFaq({ faq_id, question, answer });
            toast.success("FAQ updated successfully");
            await getFaqs();
        } catch (error) {
            console.error("Error updating FAQ:", error);
            toast.error("Error updating FAQ");
        } finally {
            setOpenUpdate(false);
        }
    }

    return (
        <div className={styles.layout}>
            <img
                src="./images/faq.png"
                alt="Frequently Asked Questions"
                className={styles.faqImage}
            />
            <div>
                <Dialog.Root open={open} onOpenChange={setOpen}>
                    <Dialog.Trigger>
                        <button className={styles.addFaqButton}>Add FAQ</button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className={styles.dialog_overlay} />
                        <Dialog.Content className={styles.dialog_content}>
                            <Dialog.Title className={styles.dialog_title}>
                                Create FAQ
                                <i
                                    className={`${styles.fa} fa fa-close`}
                                    onClick={() => setOpen(false)}
                                ></i>
                            </Dialog.Title>
                            <Dialog.Description
                                className={styles.dialog_description}
                            >
                                Please fill in the details:
                            </Dialog.Description>
                            <form method="post" onSubmit={addFaq}>
                                <fieldset className={styles.Fieldset_question}>
                                    <InputField
                                        label="Question"
                                        name="question"
                                        value={question}
                                        onChange={(e) => {
                                            setQuestion(e.target.value);
                                        }}
                                        error=""
                                    />
                                </fieldset>

                                <fieldset className={styles.Fieldset_answer}>
                                    <InputField
                                        label="Answer"
                                        name="answer"
                                        value={answer}
                                        onChange={(e) => {
                                            setAnswer(e.target.value);
                                        }}
                                        multipleLines={true}
                                        error=""
                                    />
                                </fieldset>

                                <div
                                    style={{
                                        display: "flex",
                                        marginTop: 25,
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <button
                                        className={styles.saveButton}
                                        type="submit"
                                    >
                                        Save changes
                                    </button>
                                </div>
                            </form>
                        </Dialog.Content>
                        <Dialog.Close asChild>
                            <button
                                className={styles.icon_button}
                                aria-label="Close"
                            >
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
            <AccordionDemo faqs={faqs} />

            <Dialog.Root open={openUpdate} onOpenChange={setOpenUpdate}>
                <Dialog.Portal>
                    <Dialog.Overlay className={styles.dialog_overlay} />
                    <Dialog.Content
                        onOpenAutoFocus={(event) => {
                            event?.preventDefault();
                        }}
                        className={styles.dialog_content}
                    >
                        <Dialog.Title className={styles.dialog_title}>
                            Update FAQ
                            <i
                                className={`${styles.fa} fa fa-close`}
                                onClick={() => setOpenUpdate(false)}
                            ></i>
                        </Dialog.Title>
                        <Dialog.Description
                            className={styles.dialog_description}
                        >
                            Please fill in the details
                        </Dialog.Description>
                        <form
                            method="post"
                            onSubmit={(e) => updateFaq(e, faq?.faq_id)}
                        >
                            <fieldset className={styles.Fieldset_question}>
                                <InputField
                                    label="Question"
                                    name="question"
                                    value={faq?.question || ""}
                                    onChange={(e) =>
                                        setFaq((prevState) =>
                                            prevState
                                                ? {
                                                      ...prevState,
                                                      question: e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                    error=""
                                />
                            </fieldset>

                            <fieldset className={styles.Fieldset_answer}>
                                <InputField
                                    label="Answer"
                                    name="answer"
                                    value={faq?.answer || ""}
                                    onChange={(e) =>
                                        setFaq((prevState) =>
                                            prevState
                                                ? {
                                                      ...prevState,
                                                      answer: e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                    multipleLines={true}
                                    error=""
                                />
                            </fieldset>

                            <div
                                style={{
                                    display: "flex",
                                    marginTop: 25,
                                    justifyContent: "flex-end",
                                }}
                            >
                                <button
                                    className={styles.saveButton}
                                    type="submit"
                                >
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </Dialog.Content>
                    <Dialog.Close asChild>
                        <button
                            className={styles.icon_button}
                            aria-label="Close"
                        >
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                </Dialog.Portal>
            </Dialog.Root>

            <Dialog.Root
                open={openDeleteConfirm}
                onOpenChange={setOpenDeleteConfirm}
            >
                <Dialog.Portal>
                    <Dialog.Overlay className={styles.dialog_overlay} />
                    <Dialog.Content className={styles.dialog_content2}>
                        <Dialog.Title className={styles.dialog_title}>
                            Confirm Delete
                        </Dialog.Title>
                        <Dialog.Description
                            className={styles.dialog_description2}
                        >
                            Are you sure you want to delete this FAQ?
                        </Dialog.Description>
                        <div className={styles.buttonsConfirmation}>
                            <button
                                className={styles.noButton}
                                onClick={() => setOpenDeleteConfirm(false)}
                            >
                                No
                            </button>
                            <button
                                className={styles.yesButton}
                                onClick={confirmDeleteFaq}
                            >
                                Yes
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}