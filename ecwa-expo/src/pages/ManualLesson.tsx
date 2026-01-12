import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Palette, Radii, Shadow, Spacing } from "@/constants/theme";
import { manualApi, isSubscriptionError, getAllSundaySchoolManuals } from "@/src/lib/api";
import Toast from "react-native-toast-message";
import { HTMLRenderer } from "@/src/lib/html-renderer";
import { useFontSize } from "@/src/lib/font-size-context";

const ManualLesson = () => {
  const router = useRouter();
  const { getScaledSize } = useFontSize();
  const params = useLocalSearchParams<{
    type?: string | string[];
    year?: string | string[];
    language?: string | string[];
    lessonId?: string | string[];
  }>();
  const type = Array.isArray(params.type) ? params.type[0] ?? "sunday-school" : params.type ?? "sunday-school";
  const year = Array.isArray(params.year) ? params.year[0] ?? `${new Date().getFullYear()}` : params.year ?? `${new Date().getFullYear()}`;
  const language = Array.isArray(params.language) ? params.language[0] ?? "english" : params.language ?? "english";
  const lessonId = Array.isArray(params.lessonId) ? params.lessonId[0] ?? "1" : params.lessonId ?? "1";

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [backPressed, setBackPressed] = useState(false);
  const [lesson, setLesson] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadLesson = async () => {
      setIsLoading(true);
      
      // For Sunday School, check payment status first
      if (type === "sunday-school") {
        try {
          const allManuals = await getAllSundaySchoolManuals();
          const yearNum = typeof year === "string" ? parseInt(year, 10) : year;
          const langLower = (language || "").toLowerCase();
          
          const manual = allManuals.find((item: any) => {
            const itemYear = typeof item.year === "string" ? parseInt(item.year, 10) : item.year;
            const itemLang = (item.language || "").toLowerCase();
            return itemYear === yearNum && itemLang === langLower;
          });
          
          if (manual) {
            const access = manual.paid === true || manual.sponsored === true || manual.is_free === true;
            
            // If no access, redirect to purchase screen
            if (!access) {
              setIsLoading(false);
              router.replace({
                pathname: "/purchase-manual" as any,
                params: {
                  manual_id: String(manual.id),
                  year: String(year),
                  language: language,
                },
              });
              return;
            }
          }
        } catch (_error) {
          // Payment check failed, continue loading lesson (may show error later)
        }
      }
      
      // Load lesson detail
      try {
        const data = await manualApi.getLessonDetail(type, year, language, lessonId);
        setLesson(data);
      } catch (error) {
        if (isSubscriptionError(error)) {
          // Payment/subscription error - navigate back to lessons list
          // Payment check should have happened before reaching this screen
          router.back();
          return;
        }
        Toast.show({
          type: "error",
          text1: "Lesson Not Found",
          text2: `Unable to load lesson ${lessonId}. Please try again.`,
          visibilityTime: 4000,
        });
        router.back();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLesson();
  }, [language, lessonId, router, type, year]);

  const title =
    type === "sunday-school" ? "Sunday School Manual" : "Bible Study Manual";

  // Helper function to extract conclusion and memory verse from content if embedded
  const extractSections = (content: string | undefined | null) => {
    if (!content) return { content: '', conclusion: '', memoryVerse: '' };
    
    let cleanContent = content;
    let extractedConclusion = '';
    let extractedMemoryVerse = '';
    
    // More comprehensive patterns to match conclusion and memory verse sections
    // Handle various HTML and text formats
    // Supports both English and Yoruba labels
    
    // Memory Verse patterns (extract first since it's usually at the end)
    // ONLY English: "MEMORY VERSE" - Do NOT extract Yoruba labels
    const memoryVersePatterns = [
      // HTML heading patterns - English
      /<h[1-6][^>]*>\s*MEMORY\s*VERSE:?\s*<\/h[1-6]>[\s\S]*?$/i,
      // HTML paragraph with strong/bold - English
      /<p[^>]*>\s*<strong[^>]*>\s*MEMORY\s*VERSE:?\s*<\/strong>\s*<\/p>[\s\S]*?$/i,
      // Plain text patterns - English (with capture group)
      /MEMORY\s*VERSE:?\s*[\n\r]+(.*?)$/is,
      /MEMORY\s*VERSE:?\s*(.*?)$/is,
      // HTML div/section patterns - English
      /<div[^>]*>\s*MEMORY\s*VERSE:?\s*<\/div>[\s\S]*?$/i,
      // Additional patterns for variations - English
      /<strong[^>]*>\s*MEMORY\s*VERSE:?\s*<\/strong>[\s\S]*?$/i,
      /<b[^>]*>\s*MEMORY\s*VERSE:?\s*<\/b>[\s\S]*?$/i,
    ];
    
    // Conclusion patterns
    // ONLY English: "CONCLUSION" - Do NOT extract Yoruba labels
    const conclusionPatterns = [
      // HTML heading patterns - English
      /<h[1-6][^>]*>\s*CONCLUSION:?\s*<\/h[1-6]>[\s\S]*?(?=<h[1-6]|MEMORY\s*VERSE|$)/i,
      // HTML paragraph with strong/bold - English
      /<p[^>]*>\s*<strong[^>]*>\s*CONCLUSION:?\s*<\/strong>\s*<\/p>[\s\S]*?(?=<p[^>]*>MEMORY|MEMORY\s*VERSE|$)/i,
      // Plain text patterns - English (with capture group)
      /CONCLUSION:?\s*[\n\r]+(.*?)(?=MEMORY\s*VERSE|$)/is,
      /CONCLUSION:?\s*(.*?)(?=MEMORY\s*VERSE|$)/is,
      // HTML div/section patterns - English
      /<div[^>]*>\s*CONCLUSION:?\s*<\/div>[\s\S]*?(?=<div[^>]*>MEMORY|MEMORY\s*VERSE|$)/i,
      // Additional patterns for variations - English
      /<strong[^>]*>\s*CONCLUSION:?\s*<\/strong>[\s\S]*?(?=MEMORY\s*VERSE|$)/i,
      /<b[^>]*>\s*CONCLUSION:?\s*<\/b>[\s\S]*?(?=MEMORY\s*VERSE|$)/i,
    ];
    
    // Extract memory verse first (usually at the end)
    for (let i = 0; i < memoryVersePatterns.length; i++) {
      const pattern = memoryVersePatterns[i];
      const match = cleanContent.match(pattern);
      if (match && match[0]) {
        // Extract the content after the label (English only)
        let verseContent = match[1] || match[0];
        // Remove the English label only
        verseContent = verseContent
          .replace(/MEMORY\s*VERSE:?\s*/i, '')
          .trim();
        if (verseContent && verseContent.length > 10) { // Ensure it's not just whitespace
          extractedMemoryVerse = verseContent;
          // Remove memory verse from content
          cleanContent = cleanContent.replace(pattern, '').trim();
          break;
        }
      }
    }
    
    // Extract conclusion (usually before memory verse)
    for (let i = 0; i < conclusionPatterns.length; i++) {
      const pattern = conclusionPatterns[i];
      const match = cleanContent.match(pattern);
      if (match && match[0]) {
        // Extract the content after the label (English only)
        let conclusionContent = match[1] || match[0];
        // Remove the English label and stop before memory verse
        conclusionContent = conclusionContent
          .replace(/CONCLUSION:?\s*/i, '')
          .replace(/MEMORY\s*VERSE.*$/is, '')
          .trim();
        if (conclusionContent && conclusionContent.length > 10) { // Ensure it's not just whitespace
          extractedConclusion = conclusionContent;
          // Remove conclusion from content
          cleanContent = cleanContent.replace(pattern, '').trim();
          break;
        }
      }
    }
    
    return {
      content: cleanContent.trim(),
      conclusion: extractedConclusion.trim(),
      memoryVerse: extractedMemoryVerse.trim(),
    };
  };

  // Helper function to render content (HTML or plain text)
  const renderContent = (content: string | undefined | null, style?: any) => {
    if (!content) return null;
    // Check if current language is Yoruba
    const isYoruba = language.toLowerCase() === 'yoruba' || language.toLowerCase() === 'yorùbá';
    return <HTMLRenderer html={content} baseStyle={style || styles.sectionContent} isYoruba={isYoruba} />;
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Palette.accent} />
        <Text style={styles.loadingText}>Loading lesson...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push({
            pathname: "/(tabs)/manuals/lessons",
            params: { type, year, language },
          })}
          onPressIn={() => setBackPressed(true)}
          onPressOut={() => setBackPressed(false)}
          activeOpacity={0.7}
        >
          <ArrowLeft
            size={20}
            color={backPressed ? Palette.accent : Palette.textDefault}
          />
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>
            {title} {year}
          </Text>

          <Text style={styles.headerSubtitle}>
            Lesson {lesson?.number ?? lessonId}
          </Text>

          {/* LANGUAGE USED HERE */}
            <Text style={styles.headerSubtitleLanguage}>
              {language} Version
            </Text>
        </View>

        <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
          <Share2 size={20} color={Palette.textDefault} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setIsBookmarked(!isBookmarked)}
          activeOpacity={0.7}
        >
          <Bookmark
            size={20}
            color={Palette.textDefault}
            fill={isBookmarked ? Palette.accent : "none"}
          />
        </TouchableOpacity>
      </View>

      {/* LESSON BODY */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* TOPIC CARD */}
            <View style={styles.card}>
              <View style={styles.badge}>
                <Text style={[styles.badgeText, { fontSize: getScaledSize(12) }]}>Lesson {lesson?.number ?? lessonId}</Text>
              </View>

              <Text style={[styles.topicTitle, { fontSize: getScaledSize(24) }]}>
                {lesson?.topic || lesson?.title || "Lesson"}
              </Text>

              <Text style={[styles.texts, { fontSize: getScaledSize(14) }]}>
                <Text style={styles.textsLabel}>Texts:</Text> {lesson?.bible_text || lesson?.texts || "—"}
              </Text>
            </View>

          {/* AIM - Separate Card */}
          {lesson?.aim && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Aim</Text>
              <View style={styles.sectionBody}>
                {renderContent(lesson.aim)}
              </View>
            </View>
          )}

          {/* INTRODUCTION - Separate Card */}
          {lesson?.introduction && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Introduction</Text>
              <View style={styles.sectionBody}>
                {renderContent(lesson.introduction)}
              </View>
            </View>
          )}

          {/* MAIN CONTENT - Separate Card */}
          {(() => {
            // Extract conclusion and memory verse from content if embedded
            const extracted = extractSections(lesson?.content);
            
            // Prioritize API fields, fall back to extracted values
            const displayContent = extracted.content || lesson?.content || '';
            const displayConclusion = lesson?.conclusion || extracted.conclusion || '';
            const displayMemoryVerse = lesson?.memory_verse || extracted.memoryVerse || '';
            
            return (
              <>
                {displayContent && displayContent.trim().length > 0 && (
                  <View style={styles.sectionCard}>
                    <Text style={[styles.sectionTitle, { fontSize: getScaledSize(20) }]}>Content</Text>
                    <View style={styles.sectionBody}>
                      {renderContent(displayContent)}
                    </View>
                  </View>
                )}
                
                {/* CONCLUSION - Separate Card (extracted or from API) */}
                {displayConclusion && displayConclusion.trim().length > 0 && (
                  <View style={styles.sectionCard}>
                    <Text style={[styles.sectionTitle, { fontSize: getScaledSize(20) }]}>Conclusion</Text>
                    <View style={styles.sectionBody}>
                      {renderContent(displayConclusion)}
                    </View>
                  </View>
                )}

                {/* MEMORY VERSE - Separate Card (extracted or from API) */}
                {displayMemoryVerse && displayMemoryVerse.trim().length > 0 && (
                  <View style={[styles.sectionCard, styles.memoryVerseCard]}>
                    <Text style={[styles.memoryVerseTitle, { fontSize: getScaledSize(20) }]}>Memory Verse</Text>
                    <View style={styles.sectionBody}>
                      {renderContent(displayMemoryVerse, styles.memoryVerseText)}
                    </View>
                  </View>
                )}
              </>
            );
          })()}

          {/* SECTIONS / OUTLINE - Separate Cards (if available) */}
          {Array.isArray(lesson?.sections) && lesson.sections.length > 0
            ? lesson.sections.map((section: any, idx: number) => (
                <View key={idx} style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>
                    {section.title || section.heading || `Section ${idx + 1}`}
                  </Text>
                  <View style={styles.sectionBody}>
                    {section.content && renderContent(section.content)}
                    <View style={styles.pointsContainer}>
                      {(section.points || section.items || section.subPoints || []).map((point: any, pIdx: number) => (
                        <View key={pIdx} style={styles.pointWrapper}>
                          {renderContent(
                            typeof point === 'string' 
                              ? point 
                              : (point.content || point.text || String(point)),
                            styles.point
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))
            : null}

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e4e7f2",
    backgroundColor: Palette.background,
  },
  headerButton: {
    padding: Spacing.xs,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eef1f6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerTitleText: {
    fontSize: 14,
    fontWeight: "700",
    color: Palette.textDefault,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: 2,
  },
  headerSubtitleLanguage: {
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
    gap: Spacing.md,
  },
  card: {
    borderRadius: Radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e4e7f2",
    padding: Spacing.lg,
    backgroundColor: Palette.background,
    ...Shadow.cardSoft,
    marginBottom: 0,
  },
  sectionCard: {
    borderRadius: Radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e4e7f2",
    padding: Spacing.lg,
    backgroundColor: Palette.background,
    ...Shadow.cardSoft,
  },
  sectionBody: {
    marginTop: Spacing.sm,
  },
  badge: {
    alignSelf: "flex-start",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.textMuted,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    fontSize: 12,
    color: Palette.textMuted,
    fontWeight: "600",
  },
  topicTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: Spacing.sm,
    color: Palette.textDefault,
  },
  texts: {
    fontSize: 14,
    color: Palette.textMuted,
  },
  textsLabel: {
    fontWeight: "600",
    color: Palette.textDefault,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 0,
    color: Palette.textDefault,
    letterSpacing: -0.3,
  },
  sectionContent: {
    fontSize: 17, // Increased from 16 for better readability
    lineHeight: 28, // Increased from 26 for better line spacing, especially for Yoruba diacritics
    color: Palette.textDefault,
    marginTop: 0,
  },
  pointsContainer: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  point: {
    fontSize: 16,
    lineHeight: 26,
    color: Palette.textDefault,
  },
  pointLabel: {
    fontWeight: "700",
    color: Palette.accent,
  },
  memoryVerseCard: {
    backgroundColor: "#f0f9ff",
    borderColor: "#bae6fd",
    borderWidth: 1,
  },
  memoryVerseTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 0,
    color: "#0369a1",
    letterSpacing: -0.3,
  },
  memoryVerseText: {
    fontSize: 17, // Increased from 16 for consistency
    lineHeight: 28, // Increased from 26 for better readability
    fontStyle: "italic",
    color: Palette.textDefault,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
    color: Palette.textMuted,
  },
  pointWrapper: {
    marginBottom: 0,
  },
});

export default ManualLesson;
