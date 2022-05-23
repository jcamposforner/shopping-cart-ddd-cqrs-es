Feature: Health Check

  Scenario: Health Check
    Given I send a GET request to "/health-check"
    Then the response status code should be 200
    And the response content should be:
    """
    {
      "status": "ok"
    }
    """