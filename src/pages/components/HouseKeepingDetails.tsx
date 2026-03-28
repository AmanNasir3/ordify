import { useEffect, useState } from "react";
import styles from "../ServiceDetails.module.css";
import layoutStyles from "../ServiceDetailsLayout.module.css";
import formStyles from "../ServiceDetailsForm.module.css";
import {
  Box,
  Text,
  Flex,
  VStack,
  Button,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { Accordion } from "@chakra-ui/react";
import DefaultImage from "../../assets/images.png";
import { createOrder } from "../../services/api/Instance";
import { toaster } from "../../components/ui/toaster";

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
    id: any;
  }

  interface ServiceCategory {
    id: string;
    name: string;
    options: ServiceOption[];
  }

  const [selectedOptions, setSelectedOptions] = useState<ServiceOption[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  // Map API subcategories to departments
  const departments: ServiceCategory[] =
    subCategory?.map((sub: any) => ({
      id: sub.id.toString(),
      name: sub.name,
      options: sub.items.map((item: any) => ({
        name: item.name,
        description: item.description || "",
        id: item.id.toString(),
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

  const handleOptionToggle = (option: ServiceOption) => {
    setSelectedOptions((prev) =>
      prev.find((o) => o.id === option.id)
        ? prev.filter((o) => o.id !== option.id)
        : [...prev, option],
    );
  };

  const handleRemoveSelected = (optionId: string | number) => {
    setSelectedOptions((prev) => prev.filter((o) => o.id !== optionId));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedOptions.length === 0) {
      toaster.create({
        description: "Please select at least one service",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = {
        items: selectedOptions.map((opt) => ({ ...opt })),
        comments: comments,
        sub_booking_id: JSON.parse(localStorage.getItem("session") || "{}")
          ?.user_details?.sub_booking_id,
      };

      const response = await createOrder(formData);

      if (response.status === 200 || response.status === 201) {
        toaster.create({
          description: "Your request has been submitted successfully!",
          type: "success",
        });
        setSelectedOptions([]);
        setComments("");
      } else {
        toaster.create({
          description:
            response.data?.message ||
            "Failed to submit order. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting order:", error);

      toaster.create({
        description: "Failed to submit order. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!subCategory || departments.length === 0) {
    return (
      <div className={styles.detailsPage}>
        <div className={styles.headerSection}>
          <Skeleton height="300px" mb={6} />
          <SkeletonText noOfLines={2} mb={8} />
        </div>
        <div className={layoutStyles.detailsLayout}>
          <aside className={layoutStyles.departmentsSidebar}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height="40px" mb={2} borderRadius="8px" />
            ))}
          </aside>
          <div className={layoutStyles.optionsPanel}>
            {[1, 2, 3].map((i) => (
              <Box key={i} mb={6}>
                <Skeleton height="50px" mb={4} borderRadius="8px" />
                <VStack gap={3}>
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} height="60px" borderRadius="8px" />
                  ))}
                </VStack>
              </Box>
            ))}
          </div>
          <aside className={layoutStyles.formPanel}>
            <Skeleton height="200px" mb={4} borderRadius="8px" />
            <SkeletonText noOfLines={5} mb={6} />
            <Skeleton height="40px" borderRadius="8px" />
          </aside>
        </div>
      </div>
    );
  }

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
                          const isSelected = selectedOptions.some(
                            (o) => o.id === option.id,
                          );
                          return (
                            <Box
                              key={option.id}
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
                                    checked={selectedOptions.some(
                                      (o) => o.id === option.id,
                                    )}
                                    onChange={() => handleOptionToggle(option)}
                                    id={`opt-${option.id}`}
                                    style={{ marginTop: "4px", flexShrink: 0 }}
                                  />
                                  <Box flex="1">
                                    <label
                                      htmlFor={`opt-${option.id}`}
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
                <span key={opt.id} className={layoutStyles.selectedOption}>
                  {opt.name}
                  <button
                    className={layoutStyles.removeBtn}
                    onClick={() => handleRemoveSelected(opt.id)}
                    aria-label={`Remove ${opt.name}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <form className={formStyles.formCard} onSubmit={handleSubmit}>
            <div className={formStyles.formTitle}>Your Request</div>
            <div className={formStyles.formGroup}>
              <label htmlFor="comments" className={formStyles.label}>
                Comments
              </label>
              <textarea
                id="comments"
                name="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className={formStyles.input + " " + formStyles.textarea}
                placeholder="Add any additional comments or special requests..."
              />
            </div>
            <Button
              disabled={selectedOptions.length === 0 || loading}
              w="100%"
              colorScheme="blue"
              size="lg"
              type="submit"
              className={formStyles.submitBtn}
              loading={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </aside>
      </div>
    </div>
  );
};
