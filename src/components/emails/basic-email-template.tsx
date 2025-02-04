import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface BasicEmailTemplateProps {
  hostname: string;
  fullName: string;
  link: string;
  messages: (key: string) => string;
}

export const BasicEmailTemplate = ({ hostname, fullName, link, messages }: BasicEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>{messages('preview')}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Link href={hostname}>
            <Img
              src={`${hostname}/img/logo.png`}
              width="200"
              height="35"
              alt="Ecomness Logo"
              style={{ margin: 'auto' }}
            />
          </Link>
        </Section>

        <Heading
          style={{
            textAlign: 'center',
            color: '#1d1c1d',
            fontSize: '33px',
            fontWeight: '500',
            margin: '30px 0',
            padding: '0',
            lineHeight: '42px',
          }}>
          {messages('title')}
        </Heading>

        <Text style={heroText}>
          {messages('greetings')} {fullName} {messages('text')}
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={link}>
            {messages('button')}
          </Button>
        </Section>

        <Text style={text}>{messages('note')}</Text>

        <Section style={{ paddingTop: '30px' }}>
          <Row style={footerLogos}>
            <Column style={{ width: '66%' }}>
              <Link href={hostname}>
                <Img src={`${hostname}/img/logo.png`} width="100" height="20" alt="Ecomness Logo" />
              </Link>
            </Column>
            <Column>
              <Section>
                <Row>
                  <Column>
                    <Link href="https://www.instagram.com/ecomness/">
                      <Img
                        src={`${hostname}/img/instagram.png`}
                        width="32"
                        height="32"
                        alt="instagram"
                        style={socialMediaIcon}
                      />
                    </Link>
                  </Column>
                  <Column>
                    <Link href="https://www.facebook.com/ecomness">
                      <Img
                        src={`${hostname}/img/facebook.png`}
                        width="32"
                        height="32"
                        alt="facebook"
                        style={socialMediaIcon}
                      />
                    </Link>
                  </Column>
                  <Column>
                    <Link href="https://www.tiktok.com/@ecomness">
                      <Img
                        src={`${hostname}/img/tiktok.png`}
                        width="32"
                        height="32"
                        alt="tiktok"
                        style={socialMediaIcon}
                      />
                    </Link>
                  </Column>
                </Row>
              </Section>
            </Column>
          </Row>
        </Section>

        <Section>
          <Text style={footerText}>
            ©2024 ECOMNESS GROUP. <br />
            P8M8+J66, Rue de Palestine, Ezzahra 2034.
            <br />
            (+216) 24 002 024
            <br />
            support@ecomness.com
            <br />
            All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default BasicEmailTemplate;

const footerText = {
  fontSize: '12px',
  color: '#b7b7b7',
  lineHeight: '15px',
  textAlign: 'left' as const,
  marginBottom: '50px',
};

const footerLogos = {
  marginBottom: '32px',
  paddingLeft: '8px',
  paddingRight: '8px',
  width: '100%',
};

const socialMediaIcon = {
  display: 'inline',
  marginLeft: '32px',
};

const main = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: '0 auto',
  padding: '0px 20px',
};

const logoContainer = {
  marginTop: '32px',
  marginBottom: '52px',
};

const heroText = {
  fontSize: '17px',
  lineHeight: '28px',
  marginBottom: '30px',
};

const buttonContainer = {
  padding: '27px 0 27px',
};

const button = {
  backgroundColor: '#2cb5bd',
  borderRadius: '3px',
  fontWeight: '600',
  color: '#fff',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '11px 23px',
};

const text = {
  color: '#000',
  fontSize: '14px',
  lineHeight: '24px',
};
