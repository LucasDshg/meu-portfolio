import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import { ICertifications } from '../interface/certifications.interface';
import { IExperience } from '../interface/experience.interface';
import { IProfile } from '../interface/portfolio.interface';

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyAZ9hiA.woff2',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    paddingLeft: '30%',
    paddingTop: 40,
  },
  sidebarBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '30%',
    height: '100vh',
    backgroundColor: '#18181b',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D9488',
    marginBottom: 2,
  },
  headline: {
    fontSize: 13,
    color: '#52525B',
    fontWeight: 'medium',
  },
  leftColumn: {
    width: '40%',
    marginLeft: '-40%',
    paddingHorizontal: 16,
    flexDirection: 'column',
  },
  rightColumn: {
    width: '100%',
    paddingHorizontal: 30,
  },
  sidebarSection: {
    marginBottom: 20,
  },
  sidebarTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0D9488',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sidebarItem: {
    fontSize: 9,
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 1.3,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'semibold',
    color: '#3F3F46',
    borderBottom: '1px solid #E4E4E7',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    paddingBottom: 2,
  },
  aboutText: {
    fontSize: 11,
    color: '#3F3F46',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 15,
  },
  role: {
    fontSize: 12,
    fontWeight: 'medium',
    color: '#18181B',
  },
  duration: {
    fontSize: 10,
    marginBottom: 14,
    color: '#71717A',
  },
  company: {
    fontSize: 11,
    fontWeight: 'medium',
    color: '#3F3F46',
    marginVertical: 4,
  },
  description: {
    fontSize: 10,
    color: '#3F3F46',
    lineHeight: 1.4,
    textAlign: 'justify',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 4,
  },
  skillBadge: {
    fontSize: 8,
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    color: '#52525B',
  },
});

interface ICVDocumentProps {
  profile: IProfile;
  experiences: IExperience[];
  certifications: ICertifications[];
}

export const CVDocument = ({
  profile,
  experiences,
  certifications,
}: ICVDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.sidebarBackground} fixed />

      <View style={styles.leftColumn}>
        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Contato</Text>
          <Text style={styles.sidebarItem}>{profile.email}</Text>
          <Text style={styles.sidebarItem}>{profile.phone}</Text>
          <Text style={styles.sidebarItem}>portfolio.com/u/{profile.slug}</Text>
        </View>

        {profile.socials && profile.socials.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>Redes Sociais</Text>
            {profile.socials
              .filter((s) => s.link)
              .sort((a, b) => a.order - b.order)
              .map((social) => (
                <Text key={social.id} style={styles.sidebarItem}>
                  {social.name}: {social.link}
                </Text>
              ))}
          </View>
        )}

        {certifications.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>Certificações</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={{ marginBottom: 10 }}>
                <Text
                  style={[
                    styles.sidebarItem,
                    { fontWeight: 'bold', marginBottom: 2 },
                  ]}
                >
                  {cert.name}
                </Text>
                <Text
                  style={[
                    styles.sidebarItem,
                    { color: '#71717A', fontSize: 10 },
                  ]}
                >
                  {cert.institution} ({cert.year})
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.rightColumn}>
        <View style={styles.header}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.headline}>{profile.pages.home.title}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <Text style={styles.aboutText}>{profile.pages.home.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiência Profissional</Text>
          {experiences.map((exp) => (
            <View key={exp.id} style={styles.experienceItem}>
              <Text style={styles.role}>{exp.role}</Text>
              <Text style={styles.company}>{exp.company}</Text>
              <Text style={styles.duration}>{exp.duration}</Text>
              <Text style={styles.description}>{exp.description}</Text>
              <View style={styles.skillsContainer}>
                {exp.technologies.map((tech) => (
                  <Text key={tech} style={styles.skillBadge}>
                    {tech}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);
