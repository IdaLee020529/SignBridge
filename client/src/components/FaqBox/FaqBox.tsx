import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import classNames from 'classnames';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import styles from './FaqBox.module.css';

interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof Accordion.Trigger> {
    children: React.ReactNode;
    className?: string;
  }
  
  interface AccordionContentProps extends React.ComponentPropsWithoutRef<typeof Accordion.Content> {
    children: React.ReactNode;
    className?: string;
  }

const AccordionDemo = () => (
  <Accordion.Root className={styles.AccordionRoot} type="single" defaultValue="item-1" collapsible>
    <Accordion.Item className={styles.AccordionItem} value="item-1">
      <AccordionTrigger>What is the main purpose of this website?</AccordionTrigger>
      <AccordionContent>The primary goal of our website is to bridge the communication gap between the Deaf and speaking communities by providing easy access to Malaysian Sign Language (BIM) resources and translation tools.</AccordionContent>
    </Accordion.Item>

    <Accordion.Item className={styles.AccordionItem} value="item-2">
      <AccordionTrigger>How does the sign language translation work?</AccordionTrigger>
      <AccordionContent>Our sign language translation is powered by deep learning technology that can interpret sign language gestures from videos or text and translate them into the corresponding sign language gestures or text.</AccordionContent>
    </Accordion.Item>

    <Accordion.Item className={styles.AccordionItem} value="item-3">
      <AccordionTrigger>What is the difference between the SLP and SLR systems?</AccordionTrigger>
      <AccordionContent>The SLP (Sign Language Production) system converts text into sign language gestures using an avatar, while the SLR (Sign Language Recognition) system recognizes sign language gestures from videos and translates them into text.</AccordionContent>
    </Accordion.Item>

    <Accordion.Item className={styles.AccordionItem} value="item-4">
      <AccordionTrigger>How do the educational games on the site help with learning sign language?</AccordionTrigger>
      <AccordionContent>Our educational games are designed to make learning sign language fun and interactive. "Guess the Word" helps you associate words with signs, while "Do The Sign" allows you to practice signing with real-time feedback.</AccordionContent>
    </Accordion.Item>

    <Accordion.Item className={styles.AccordionItem} value="item-5">
      <AccordionTrigger>How can I contribute to the data collection feature?</AccordionTrigger>
      <AccordionContent>You can submit a form with the sentence and the corresponding sign language video. Our sign experts will review and verify the information before it's added to our database.</AccordionContent>
    </Accordion.Item>

    <Accordion.Item className={styles.AccordionItem} value="item-6">
      <AccordionTrigger>How do I provide feedback about the website or educational games?</AccordionTrigger>
      <AccordionContent>You can fill out the feedback form available on the site to share your comments, suggestions, or ratings, focusing either on the website in general or the educational games in particular.</AccordionContent>
    </Accordion.Item>

    <Accordion.Item className={styles.AccordionItem} value="item-7">
      <AccordionTrigger>What notifications will I receive as a user of the website?</AccordionTrigger>
      <AccordionContent>You will be notified about the status of your submissions, including whether they have been accepted by a sign expert or require further revision.</AccordionContent>
    </Accordion.Item>
  </Accordion.Root>
);

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className={styles.AccordionHeader}>
      <Accordion.Trigger
        className={classNames(styles.AccordionTrigger, className)}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <ChevronDownIcon className={styles.AccordionChevron} aria-hidden />
      </Accordion.Trigger>
    </Accordion.Header>
  )
);

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
      className={classNames(styles.AccordionContent, className)}
      {...props}
      ref={forwardedRef}
    >
      <div className={styles.AccordionContentText}>{children}</div>
    </Accordion.Content>
  )
);


export default AccordionDemo;