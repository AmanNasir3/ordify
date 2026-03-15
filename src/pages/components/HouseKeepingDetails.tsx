import { useEffect, useState } from "react";
import styles from "../ServiceDetails.module.css";
import layoutStyles from "../ServiceDetailsLayout.module.css";
import formStyles from "../ServiceDetailsForm.module.css";
import {
  Box,
  Text,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { Accordion } from "@chakra-ui/react";
import DefaultImage from "../../assets/images.png";


export const HousekeepingDetails = ({
  subCategory,
  category,
}: {
  subCategory: any;
  category: any;
}) => {
  interface ServiceOption {
    name: string;
    description: string;
  }

  interface ServiceCategory {
    id: string;
    name: string;
    options: ServiceOption[];
  }

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");

  // Map API subcategories to departments
  const departments: ServiceCategory[] =
    subCategory?.map((sub: any) => ({
      id: sub.id.toString(),
      name: sub.name,
      options: sub.items.map((item: any) => ({
        name: item.name,
        description: item.description || "",
      })),
    })) || [];

  // Set first section as active on mount
  useEffect(() => {
    if (departments.length > 0 && !activeSection) {
      setActiveSection(departments[0].id);
    }
  }, [departments]);

  // Scroll spy - detect which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = departments.map((dept) =>
        document.getElementById(dept.id),
      );

      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          // Check if section is in viewport (with some offset for better UX)
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    const optionsPanel = document.querySelector(
      `.${layoutStyles.optionsPanel}`,
    );
    if (optionsPanel) {
      optionsPanel.addEventListener("scroll", handleScroll);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (optionsPanel) {
        optionsPanel.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [departments]);

  const handleScrollToSection = (categoryId: string) => {
    setActiveSection(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleOptionToggle = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    );
  };

  const handleRemoveSelected = (option: string) => {
    setSelectedOptions((prev) => prev.filter((o) => o !== option));
  };

  if (!subCategory || departments.length === 0) {
    return <div className={styles.loading}>Loading...</div>;
  }
  console.log({ category });

  return (
    <div className={styles.detailsPage}>
      <div className={styles.headerSection}>
        <img
          src={category?.image ?? DefaultImage}
          alt={category?.name}
          className={styles.headerImg}
        />
        <h1 className={styles.title}>{category?.name}</h1>
      </div>
      <div className={layoutStyles.detailsLayout}>
        {/* Left: Departments */}
        <aside className={layoutStyles.departmentsSidebar}>
          {departments.map((dept) => (
            <button
              key={dept.id}
              className={
                layoutStyles.departmentBtn +
                (activeSection === dept.id ? " " + layoutStyles.selected : "")
              }
              onClick={() => handleScrollToSection(dept.id)}
            >
              {dept.name}
            </button>
          ))}
        </aside>
        {/* Middle: Categories with Accordions */}
        <section className={layoutStyles.optionsPanel}>
          <Accordion.Root
            multiple
            defaultValue={departments.map((d) => d.id)}
            collapsible
          >
            {departments.map((category) => (
              <div
                key={category.id}
                id={category.id}
                style={{
                  marginBottom: "1rem",
                  scrollMarginTop: "100px",
                }}
              >
                <Accordion.Item value={category.id}>
                  <Box
                    bg="white"
                    borderRadius="12px"
                    boxShadow={activeSection === category.id ? "md" : "sm"}
                    overflow="hidden"
                    borderWidth="2px"
                    transition="all 0.3s"
                  >
                    <Accordion.ItemTrigger
                      style={{
                        width: "100%",
                        padding: "1rem",
                        backgroundColor: "#f7fafc",
                        borderBottom: "1px solid #e2e8f0",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text fontSize="lg" fontWeight="700" color="gray.800">
                        {category.name}
                      </Text>
                      <Accordion.ItemIndicator>▼</Accordion.ItemIndicator>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <VStack gap={0} align="stretch">
                        {category.options.map((option, idx) => {
                          const isSelected = selectedOptions.includes(
                            option.name,
                          );
                          return (
                            <Box
                              key={option.name}
                              borderBottom={
                                idx < category.options.length - 1
                                  ? "1px solid"
                                  : "none"
                              }
                              borderColor="gray.100"
                              bg={isSelected ? "blue.50" : "white"}
                              transition="background-color 0.2s"
                            >
                              <Box p={4}>
                                <Flex align="flex-start" gap={3}>
                                  <input
                                    type="checkbox"
                                    className={layoutStyles.checkbox}
                                    checked={isSelected}
                                    onChange={() =>
                                      handleOptionToggle(option.name)
                                    }
                                    id={`opt-${option.name}`}
                                    style={{ marginTop: "4px", flexShrink: 0 }}
                                  />
                                  <Box flex="1">
                                    <label
                                      htmlFor={`opt-${option.name}`}
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                        color: isSelected
                                          ? "#2b6cb0"
                                          : "#1a202c",
                                        cursor: "pointer",
                                        display: "block",
                                        marginBottom: "0.25rem",
                                      }}
                                    >
                                      {option.name}
                                    </label>
                                    <Text
                                      fontSize="sm"
                                      color={
                                        isSelected ? "blue.700" : "gray.600"
                                      }
                                      lineHeight="1.5"
                                    >
                                      {option.description}
                                    </Text>
                                  </Box>
                                </Flex>
                              </Box>
                            </Box>
                          );
                        })}
                      </VStack>
                    </Accordion.ItemContent>
                  </Box>
                </Accordion.Item>
              </div>
            ))}
          </Accordion.Root>
        </section>
        {/* Right: Selected options and form */}
        <aside className={layoutStyles.rightPanel}>
          {selectedOptions.length > 0 && (
            <div className={layoutStyles.selectedOptionsBar}>
              {selectedOptions.map((opt) => (
                <span key={opt} className={layoutStyles.selectedOption}>
                  {opt}
                  <button
                    className={layoutStyles.removeBtn}
                    onClick={() => handleRemoveSelected(opt)}
                    aria-label={`Remove ${opt}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <form className={formStyles.formCard}>
            <div className={formStyles.formTitle}>Your Request</div>
            <div className={formStyles.formGroup}>
              <label htmlFor="reservationName" className={formStyles.label}>
                Your Reservation Name
              </label>
              <input
                type="text"
                id="reservationName"
                name="reservationName"
                className={formStyles.input}
                required
              />
            </div>
            <div className={formStyles.formGroup}>
              <label htmlFor="email" className={formStyles.label}>
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={formStyles.input}
                required
              />
            </div>
            <div className={formStyles.formGroup}>
              <label htmlFor="comments" className={formStyles.label}>
                Comments
              </label>
              <textarea
                id="comments"
                name="comments"
                className={formStyles.input + " " + formStyles.textarea}
              />
            </div>
            <button type="submit" className={formStyles.submitBtn}>
              Submit Request
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
};