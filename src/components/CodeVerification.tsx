import { useState } from "react";
import {
  DialogRoot,
  DialogContent,
  DialogBody,
  DialogBackdrop,
  Input,
  Button,
  Stack,
  Text,
  Box,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { fetchHotelLogoForHeader, verifyCode } from "../services/api/Instance";

interface CodeVerificationProps {
  isOpen: boolean;
  onClose: () => void;
}

const CodeVerification = ({ isOpen, onClose }: CodeVerificationProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCode(value);
    if (error) setError("");
  };

  const handleVerify = async () => {
    if (!code || code.length === 0) {
      setError("Please enter your check-in code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await verifyCode(code);

      if (response.status === 200 && response.data.token) {
        const data = await fetchHotelLogoForHeader();
        // Store token in session
        const session = {
          token: response.data.token,
          logoURL: data.data.logo_url,
          hotel_name: response.data.hotel_name,
          user_details: response.data,
        };
        localStorage.setItem("session", JSON.stringify(session));

        onClose();
      } else {
        setError(response.data.message || "Invalid code. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={() => {}}
      closeOnInteractOutside={false}
      closeOnEscape={false}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogBackdrop backdropFilter="blur(12px)" bg="blackAlpha.800" />
      <DialogContent
        maxW="600px"
        mx={4}
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        borderRadius="2xl"
        boxShadow="2xl"
        bg="white"
        p={0}
      >
        <DialogBody p={0}>
          <Box
            bgGradient="to-br"
            gradientFrom="green.500"
            gradientTo="green.600"
            py={10}
            px={8}
            textAlign="center"
            borderTopRadius="2xl"
          >
            <Heading size="xl" color="white" mb={3}>
              Verification Required
            </Heading>
            <Text fontSize="md" color="green.50" maxW="400px" mx="auto">
              Please enter your check-in code to continue
            </Text>
          </Box>

          <Box px={8} py={10}>
            <Stack gap={6}>
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.600"
                  mb={3}
                  textAlign="center"
                >
                  Enter Code
                </Text>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={handleInputChange}
                  placeholder="Enter code"
                  autoFocus
                  size="xl"
                  fontSize="5xl"
                  textAlign="center"
                  letterSpacing="0.3em"
                  fontWeight="bold"
                  height="120px"
                  variant="outline"
                  borderWidth="3px"
                  borderColor={error ? "red.400" : "gray.200"}
                  borderRadius="xl"
                  bg="gray.50"
                  color="gray.800"
                  _hover={{
                    borderColor: error ? "red.400" : "gray.300",
                    bg: "white",
                  }}
                  _focus={{
                    borderColor: error ? "red.500" : "green.500",
                    boxShadow: error
                      ? "0 0 0 3px rgba(245, 101, 101, 0.2)"
                      : "0 0 0 3px rgba(72, 187, 120, 0.2)",
                    bg: "white",
                  }}
                  _placeholder={{
                    color: "gray.300",
                  }}
                />
              </Box>

              {error && (
                <Flex
                  bg="red.50"
                  color="red.700"
                  p={4}
                  borderRadius="lg"
                  fontSize="sm"
                  fontWeight="medium"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  borderWidth="1px"
                  borderColor="red.200"
                  animation="shake 0.3s"
                >
                  <Text fontSize="lg">⚠️</Text>
                  <Text>{error}</Text>
                </Flex>
              )}

              <Button
                onClick={handleVerify}
                size="2xl"
                backgroundColor={"darkgreen"}
                width="full"
                loading={loading}
                disabled={!code || code.length === 0}
                height="60px"
                fontSize="lg"
                fontWeight="bold"
                borderRadius="xl"
                boxShadow="md"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                transition="all 0.2s"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </Button>
            </Stack>
          </Box>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default CodeVerification;
