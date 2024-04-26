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
    const [openFaqId, setOpenFaqId] = useState<string | undefined>(undefined);

    const AccordionDemo = ({ faqs }: { faqs: FaqData[] }) => (
        <Accordion.Root
            className={styles.AccordionRoot}
            type="single"
            defaultValue={openFaqId} 
            onValueChange={setOpenFaqId}
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
                                onClick={() => {
                                    setFaq(faq);
                                    setOpenUpdate(true);
                                    setOpenFaqId(faq.faq_id.toString());
                                }}
                                className={styles.updateFaqButton}
                            >
                                <FontAwesomeIcon icon={faEdit} />
                            </button>

                            <button
                                onClick={() => deleteFaq(faq.faq_id)}
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

    if (loading) {
        return <p>Loading FAQs...</p>;
    }

    async function addFaq(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            await CreateFaq({ question, answer });
            toast.success("FAQ created successfully");
            await getFaqs();
        } catch (error) {
            console.error("Error creating FAQ:", error);
            toast.error("Error creating FAQ");
        } finally {
            setOpen(false);
        }
    }

    async function deleteFaq(faq_id: number) {
        try {
            await DeleteFaq(faq_id);
            toast.success("FAQ deleted successfully");
            await getFaqs();
        } catch (error) {
            console.error("Error deleting FAQ:", error);
            toast.error("Error deleting FAQ");
        }
    }

    async function updateFaq(
        e: React.FormEvent<HTMLFormElement>,
        faq_id: number | undefined
    ) {
        e.preventDefault();

        if (!faq_id) return;

        const form = e.target as HTMLFormElement;
        const question = form.question.value;
        const answer = form.answer.value;

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
                            <Dialog.Title className={styles.dialog_title}>Create FAQ</Dialog.Title>
                            <Dialog.Description className={styles.dialog_description}>
                                Please fill in the details:
                            </Dialog.Description>
                            <form method="post" onSubmit={addFaq}>
                                <fieldset className={styles.Fieldset}>
                                    <label
                                        className={styles.Label}
                                        htmlFor="question"
                                    >
                                        Question
                                    </label>
                                    <div>
                                        <input
                                            className={styles.Input}
                                            id="question"
                                            onChange={(e) => {
                                                setQuestion(e.target.value);
                                            }}
                                        />
                                    </div>
                                </fieldset>

                                <fieldset className={styles.Fieldset}>
                                    <label
                                        className={styles.Label}
                                        htmlFor="answer"
                                    >
                                        Answer
                                    </label>
                                    <div>
                                        <textarea
                                            className={styles.Input}
                                            id="answer"
                                            onChange={(e) => {
                                                setAnswer(e.target.value);
                                            }}
                                        ></textarea>
                                    </div>
                                </fieldset>

                                <div
                                    style={{
                                        display: "flex",
                                        marginTop: 25,
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <button
                                        className={styles.save_button}
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
                    <Dialog.Content className={styles.dialog_content}>
                        <Dialog.Title>Update FAQ Question</Dialog.Title>
                        <Dialog.Description>
                            Please fill in the details
                        </Dialog.Description>
                        <form
                            method="post"
                            onSubmit={(e) => updateFaq(e, faq?.faq_id)}
                        >
                            <fieldset className={styles.Fieldset}>
                                <label
                                    className={styles.Label}
                                    htmlFor="question"
                                >
                                    Question
                                </label>
                                <div>
                                    <input
                                        className={styles.Input}
                                        id="question"
                                        value={faq?.question || ""}
                                        onChange={(e) =>
                                            setFaq((prevState) =>
                                                prevState
                                                    ? {
                                                          ...prevState,
                                                          question:
                                                              e.target.value,
                                                      }
                                                    : null
                                            )
                                        }
                                    />
                                </div>
                            </fieldset>

                            <fieldset className={styles.Fieldset}>
                                <label
                                    className={styles.Label}
                                    htmlFor="answer"
                                >
                                    Answer
                                </label>
                                <div>
                                    <textarea
                                        className={styles.Input}
                                        id="answer"
                                        value={faq?.answer || ""}
                                        onChange={(e) =>
                                            setFaq((prevState) =>
                                                prevState
                                                    ? {
                                                          ...prevState,
                                                          answer: e.target
                                                              .value,
                                                      }
                                                    : null
                                            )
                                        }
                                    ></textarea>
                                </div>
                            </fieldset>

                            <div
                                style={{
                                    display: "flex",
                                    marginTop: 25,
                                    justifyContent: "flex-end",
                                }}
                            >
                                <button
                                    className={styles.save_button}
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
    );
}
