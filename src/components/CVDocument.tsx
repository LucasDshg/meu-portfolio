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
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D9488',
    marginBottom: 4,
  },
  headline: {
    fontSize: 14,
    color: '#52525B',
    marginBottom: 8,
    fontWeight: 'medium',
  },
  contactRow: {
    flexDirection: 'row',
    fontSize: 10,
    color: '#71717A',
    gap: 10,
  },
  section: {
    marginTop: 20,
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
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  role: {
    fontSize: 12,
    fontWeight: 'medium',
    color: '#18181B',
  },
  duration: {
    fontSize: 10,
    color: '#71717A',
  },
  company: {
    fontSize: 11,
    fontWeight: 'medium',
    color: '#3F3F46',
    marginBottom: 6,
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
      <View style={styles.header}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.headline}>{profile.pages.home.title}</Text>
        <View style={styles.contactRow}>
          <Text>{profile.email}</Text>
          <Text>•</Text>
          <Text>{profile.phone}</Text>
          <Text>•</Text>
          <Text>portfolio.com/u/{profile.slug}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo</Text>
        <Text style={styles.aboutText}>{profile.pages.home.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experiência Profissional</Text>
        {experiences.map((exp) => (
          <View key={exp.id} style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <Text style={styles.role}>{exp.role}</Text>
              <Text style={styles.duration}>{exp.duration}</Text>
            </View>
            <Text style={styles.company}>{exp.company}</Text>
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

      {certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certificações</Text>
          {certifications.map((cert) => (
            <View key={cert.id} style={{ marginBottom: 8 }}>
              <Text style={styles.role}>{cert.name}</Text>
              <Text style={styles.duration}>
                {cert.institution} — {cert.year}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);
